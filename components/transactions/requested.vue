<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Request Transaction'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

      <div class="w-full flex p-1">
        <div class="grow">
          <div class="font-bold"> Keyword </div>
          <input class="w-full border-black border-solid border-2 p-1" type="text" v-model="search" name="search"
            placeholder="Keyword">
        </div>
        <div class="flex flex-col ml-1">
          <div class="font-bold"> Filter </div>
          <select class="w-full grow border-black border-solid border-2 p-1" v-model="selected_filter_likes">
            <option v-for="filter_like in filter_likes" :value="filter_like.var">{{filter_like.val}}</option>
          </select>
        </div>

        <!-- <div class="pl-1">
          <div class="font-bold"> Sort By </div>
          <select class="w-full border-black border-solid border-2 p-1" v-model="sort.field">
            <option value="created_at">Created At</option>
            <option value="email">Email</option>
            <option value="fullname">Fullname</option>
          </select>
        </div> 
        <div class="pl-1">
          <div class="font-bold"> Sort Order </div>
          <select class="w-full border-black border-solid border-2 p-1" v-model="sort.by">
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>-->
        <div class="flex items-end pl-1">
          <button class="w-full border-black border-solid border-2 p-1" type="button" name="button" @click="searching()">
            <IconsSearch class="text-2xl" />
          </button>
        </div>
      </div>
      <div class="w-full flex justify-center items-center grow h-0 p-1">

        <div v-if="transactions.length == 0" class="">
          Maaf Tidak Ada Record
        </div>

        <div v-else class="w-full h-full overflow-auto" role="sticky" ref="loadRef" @scroll="loadMore">
          <table class="tacky">
            <thead>
              <tr class="sticky top-0 !z-[2]">
                <th>No.</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Id</th>
                <th>Source</th>
                <th>Target</th>
                <th>Status</th>
                <th>Requested At</th>
                <th>Requested By</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(transaction, index) in transactions" :key="index" @click="selected = index"
                :class="selected == index ? 'active' : ''">
                <td>{{ index + 1 }}.</td>
                <td>{{ $moment(transaction.created_at).format("DD-MM-Y HH:mm:ss") }}</td>
                <td>{{ $moment(transaction.updated_at).format("DD-MM-Y HH:mm:ss") }}</td>
                <td>{{ transaction.id }}</td>
                <td>{{ transaction.warehouse_source?.name }}</td>
                <td>{{ transaction.warehouse_target?.name }}</td>
                <td>{{ transaction.status }}</td>
                <td>{{ $moment(transaction.requested_at).format("DD-MM-Y HH:mm:ss") }}</td>
                <td>{{ transaction.requester?.username }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="flex" style="justify-content:end; padding:5px;">
        <button @click="fnClose()" class="w-36 m-1 text-black p-2 rounded-sm">
          Cancel
        </button>
        <button @click="confirm()" class="w-36 m-1 bg-blue-600 text-white p-2 rounded-sm">
          Confirm
        </button>
      </div>
    </div>
  </section>
  <PopupMini :type="'custome'" :show="confirm_box" :data="confirm_data" :fnClose="togglePopupMiniBox" :fnConfirm="confirmOk" >
    <template #words>
      Data akan diproses dan <b>tidak dapat dikembalikan lagi</b>, yakin untuk melanjutkan ?
    </template>
  </PopupMini>
</template>

<script setup>

const { $moment } = useNuxtApp()
import { storeToRefs } from 'pinia';
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';

const { pointFormat } = useUtils();
const filter_likes = [{
  var : "all",
  val : "All"
},{
  var : "warehouse_target_name",
  val : "Target"
},
{
  var : "warehouse_source_name",
  val : "Source"
}
];
const selected_filter_likes = ref("all"); 

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
})


const token = useCookie('token');

const transactions = ref([]);


const search = ref("");
const sort = ref({
  field: "created_at",
  by: "asc"
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
    params.like = "";
    if(selected_filter_likes.value == "all"){
      params.like = filter_likes.filter((x)=>x.var!="all")
      .map((e)=>`${e.var}:%${search.value}%`).join(",");
    }else{      
      params.like = `${selected_filter_likes.value}:%${search.value}%`
    }
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
  if (params.page == 1) transactions.value = [];
  if(params.page > 1){
    params.first_row = JSON.stringify(transactions.value[0]);
  }
  const { data, error, status } = await useMyFetch("/api/request_transactions", {
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
    transactions.value = data.value.data;
    if (loadRef.value) loadRef.value.scrollTop = 0;
  } else if (scrolling.value.page > 1) {
    transactions.value = [...transactions.value, ...data.value.data];
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

// const selectRow = () => {
//   if (selected.value > -1) {
//     props.fnSelect(transactions.value[selected.value]);
//   } else {
//     props.fnSelect({
//       id: "",
//       email: "",
//       fullname: ""
//     });
//   }
// }

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true)
    searching();
}, {
  immediate: true
});

const { display } = useAlertStore();
const emit = defineEmits(['update_request_notif']);

const confirm_data = ref({});
const confirm_box = ref(false);

const confirm = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    confirm_data.value = {
      id : transactions.value[selected.value].id,
      source : transactions.value[selected.value].warehouse_source.name,
      target : transactions.value[selected.value].warehouse_target.name,
      "qty in" : transactions.value[selected.value].qty_in,
    };
    confirm_box.value = true;
  }
};
const togglePopupMiniBox = async()=>{  
  if (confirm_box.value) {
    confirm_box.value = false;
  }
};
const confirmOk = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("id", transactions.value[selected.value].id);  
  // data_in.append("_method", "DELETE");

  const { data, error, status } = await useMyFetch("/api/request_transaction_confirm", {
    method: "post",
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json',
    },
    body: data_in,
    retry: 0,
  });
  useCommonStore().loading_full = false;
  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }
  transactions.value.splice(selected.value,1);
  emit('update_request_notif',transactions.value.length); 
  confirm_box.value = false;
}
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
  left: 0px;
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
