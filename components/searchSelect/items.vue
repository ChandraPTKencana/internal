<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Search And Select Item'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

      <form action="#" class="w-full flex p-1">
        <div class="grow">
          <div class="font-bold"> Keyword </div>
          <input ref="ref_keyword" class="" type="text" v-model="search" name="search"
            placeholder="Keyword" @keyup="autoSearchKeyword()">
        </div>
        <div class="pl-1">
          <div class="font-bold"> Sort By </div>
          <select class="" v-model="sort.field">
            <option value="created_at">Created At</option>
            <option value="id">ID</option>
            <option value="name">Nama</option>
          </select>
        </div>
        <div class="pl-1">
          <div class="font-bold"> Sort Order </div>
          <select class="" v-model="sort.by">
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
        <div class="flex items-end pl-1">
          <button class="" type="submit" name="button" @click.prevent="searching()">
            <IconsSearch class="text-2xl" />
          </button>
        </div>
      </form>
      <div class="w-full flex justify-center items-center grow h-0 p-1">

        <div v-if="items.length == 0" class="">
          Maaf Tidak Ada Record
        </div>

        <div v-else class="w-full h-full overflow-auto" role="sticky" ref="loadRef" @scroll="loadMore">
          <table class="tacky w-full">
            <thead>
              <tr class="sticky top-0 !z-[2]">
                <th v-if="enableMultiSelect" class="min-w-[28px] !w-[28px] max-w-[28px]"></th>
                <th class="min-w-[50px] !w-[50px] max-w-[50px] ">No.</th>
                <th class="min-w-[50px] !w-[50px] max-w-[50px] ">ID</th>
                <th>Name</th>
                <th>Unit</th>
                <th class="min-w-[170px] !w-[170px] max-w-[170px] ">Created At</th>
                <th class="min-w-[170px] !w-[170px] max-w-[170px] ">Updated At</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index" @click="clickList(index)"
                :class="selected == index ? 'active' : ''">
                <td v-if="enableMultiSelect">
                  <input type="checkbox" :checked="isExists(item)" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" @click="addOrRemoveFromList(item)">
                </td>
                <td>{{ index + 1 }}.</td>
                <td class="bold">{{ item.id }}</td>
                <td class="whitespace-normal break-words">{{ item.name }}</td>
                <td>{{ item.unit.name }}</td>
                <td>{{ $moment(item.created_at).format("DD-MM-Y HH:mm:ss") }}</td>
                <td>{{ $moment(item.updated_at).format("DD-MM-Y HH:mm:ss") }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="flex" style="justify-content:end; padding:5px;">
        <div v-if="enableMultiSelect" class="grow flex items-center">
          Selected Items: {{ selected_items.length }} 
          <button type="button" class="ml-3" @click="show_box=true"> View all Items </button>
        </div>
        <button @click="selectRow()" class="w-36 m-1 bg-blue-600 text-white rounded-sm">
          Select
        </button>
      </div>
    </div>
  </section>

  <PopupMiniMulti :show="show_box" :data="selected_items" :fnClose="toggleClose" :fnConfirm="selectRow" :multi_key ="multi_key" :fnRemoveFromList="removeList"/>

</template>

<script setup>

const { $moment } = useNuxtApp()
import { storeToRefs } from 'pinia';
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';


const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  fnClose: {
    type: Function,
    required: false,
  },
  fnSelect: {
    type: Function,
    required: false,
  },
  fnSelectMulti: {
    type: Function,
    required: false,
  },
  enableMultiSelect: {
    type: Boolean,
    required: false
    // default: '',
  },
  excludes: {
    type: String,
    required: false,
    // default: '',
  },
  exclude_lists: {
    type: Array,
    required: false,
    // default: '',
  },
  multi_key: {
    type: Array,
    required: false
    // default: '',
  },
})

const { countClickListFn } = useUtils();

const token = useCookie('token');

const items = ref([]);


const search = ref("");
const sort = ref({
  field: "created_at",
  by: "desc"
});
const selected = ref(-1);
const scrolling = ref({
  page: 1,
  is_last_record: false,
  scrollLeft: 0,
  may_get_data: true
});
const params = {};
params._TimeZoneOffset = new Date().getTimezoneOffset();

const inject_params = () => {
  params.like = "";
  if (search.value != "") {
    params.like = `id:%${search.value}%,name:%${search.value}%`;
  }
  params.sort = "";
  if (sort.value.field) {
    params.sort = sort.value.field + ":" + sort.value.by;
  }
};

const loadRef = ref(null);

const callData = async () => {
  useCommonStore().loading_full = true;
  scrolling.value.may_get_data = false;
  params.page = scrolling.value.page;
  if (params.page == 1) items.value = [];
  if(props.exclude_lists) params.exclude_lists = JSON.stringify(props.exclude_lists);
  if(params.first_row) delete params.first_row;
  if(params.page > 1){
    params.first_row = JSON.stringify(items.value[0]);
  }
  const { data, error, status } = await useMyFetch("/api/items", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      // 'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    params: params,
    // body: {
    //   sort: "updated_at:desc"
    // },
    retry: 0,
    // server: true
  });
  useCommonStore().loading_full = false;
  scrolling.value.may_get_data = true;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  if (scrolling.value.page == 1) {
    items.value = data.value.data;
    if (loadRef.value) loadRef.value.scrollTop = 0;
  } else if (scrolling.value.page > 1) {
    items.value = [...items.value, ...data.value.data];
  }
  if (data.value.data.length == 0) {
    scrolling.value.is_last_record = true;
  }
}

const loadMore = async () => {

  if (!scrolling.value.may_get_data) return;
  let parent = loadRef.value;

  if (parent.scrollLeft != scrolling.value.scrollLeft) {
    scrolling.value.scrollLeft = parent.scrollLeft;
    return;
  }

  if (scrolling.value.is_last_record) return;

  let stuck = Math.round(parent.scrollTop) + parent.clientHeight >= parent.scrollHeight - 1 ? true : false;
  if (!stuck) return;

  scrolling.value.page++;
  await callData();

}

const searching = () => {
  scrolling.value.page = 1;
  scrolling.value.is_last_record = false;
  inject_params();
  callData();
}

const show_box = ref(false);
const selected_items = ref([]);

const selectRow = () => {
  if(props.enableMultiSelect){
    props.fnSelectMulti(selected_items.value);
    show_box.value = false;
  }else{    
    if (selected.value > -1) {
      props.fnSelect(items.value[selected.value]);
    } else {
      props.fnSelect({
        id: "",
        name: "",
      });
    }
  }
}

const clickList = (index)=>{
  if(props.enableMultiSelect){ return; }
  countClickListFn(index,()=>{selected.value = index},selectRow);
}

const removeList =(key)=>{
  selected_items.value.splice(key,1);
}

const toggleClose = async()=>{  
  if (show_box.value) {
    show_box.value = false;
  }
};

const addOrRemoveFromList=(item)=>{
  const index = selected_items.value.map((x)=>x.id).indexOf(item.id);
  if (index === -1) {
  // not exist in the list
    selected_items.value.push(item);
  }else{
    // remove from the list
    selected_items.value.splice(index, 1);
  }
};

const isExists=(item)=>{
  const index = selected_items.value.map((x)=>x.id).indexOf(item.id);
  return index !== -1;
}


const ref_keyword = ref(null);

let autoSearchKeywordTimeout  = null;

const autoSearchKeyword= (val)=>{
  if(autoSearchKeywordTimeout) clearTimeout(autoSearchKeywordTimeout);
  autoSearchKeywordTimeout = setTimeout(()=>{
    searching()
  },500);
};


watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    selected_items.value = [];
    searching();
    setTimeout(() => {
      ref_keyword.value.focus();
    }, 100);
  }
}, {
  immediate: true
});

</script>
<style scoped="">
table.sticky thead th:nth-child(2) {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 2;
}

table.sticky thead tr {
  top: 0;
}

.box-fixed {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0px;
}

.box-fixed>div {
  width: 95%;
  height: 95%;
  background-color: white;
  border: solid 1px #ccc;
  display: flex;
  flex-direction: column;
}
</style>
