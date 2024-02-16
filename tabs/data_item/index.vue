<template>
  <div class="w-full h-full flex flex-col border-t-4 border-slate-600">
    <!-- <Header :title="'List Item'" /> -->
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex">
        <button type="button" name="button" class="p-1 m-1 text-2xl "
          @click="form_add()">
          <IconsPlus />
        </button>
        <button type="button" name="button" class="p-1 m-1 text-2xl "
          @click="form_edit()">
          <IconsEdit />
        </button>
        <button type="button" name="button" class="p-1 m-1 text-2xl "
          @click="remove()">
          <IconsDelete />
        </button>
      </div>

      <form action="#" class="w-full flex p-1">
        <div class="grow">
          <div class="font-bold"> Keywords </div>
          <input class="" type="text" v-model="search" name="search"
            placeholder="Keyword">
        </div>
        <div class="pl-1">
          <div class="font-bold"> Sort By </div>
          <select class="" v-model="sort.field">
            <option value="created_at">Created At</option>
            <option value="name">Name</option>
            <option value="value">Value</option>
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
          <table class="tacky">
            <thead>
              <tr class="sticky top-0 !z-[2]">
                <th>No.</th>
                <th>ID</th>
                <th>Photo</th>
                <th>Name</th>
                <th>Unit</th>
                <th>Value</th>
                <th>Note</th>
                <th>Created At</th>
                <th>Created By</th>
                <th>Updated At</th>
                <th>Updated By</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index" @click="selected = index"
                :class="selected == index ? 'active' : ''">
                <td>{{ index + 1 }}.</td>
                <td class="bold">{{ item.id }}</td>
                <td class="p-0"> 
                  <div v-if="item.photo" class="absolute w-full h-full flex items-center justify-center cursor-pointer" @click="openBox(item.photo)">
                    <img :src="item.photo || '/stok/user-default.png'" alt="" class=" max-w-full max-h-full">  
                  </div>
                </td>
                <td>{{ item.name }}</td>
                <td>{{ item.unit.name }}</td>
                <td>{{ pointFormat(item.value) }}</td>
                <td>{{ item.note }}</td>
                <td>{{ $moment(item.created_at).format("DD-MM-Y HH:mm:ss") }}</td>
                <td>{{ item.creator.username }}</td>
                <td>{{ $moment(item.updated_at).format("DD-MM-Y HH:mm:ss") }}</td>
                <td>{{ item.updator.username }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <PopupMini :type="'delete'" :show="delete_box" :data="delete_data" :fnClose="toggleDeleteBox" :fnConfirm="confirmed_delete" />
    <PopupSingleImage :show="show_box" :photo="photo" :fnClose="()=>{ show_box = false}"/>
  </div>
</template>

<script setup>
const { $moment } = useNuxtApp()
import { storeToRefs } from 'pinia';

import { useAuthStore } from '~/store/auth';
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';

const { pointFormat } = useUtils();

// definePageMeta({
//   // layout: "clear",
//   middleware: [
//     function (to, from) {
//       // if (!useAuthStore().checkScopes(['ap-item-view']))
//       //   return navigateTo('/');
//       if (!useAuthStore().checkRole(["Super Admin","ClientPabrik",'KTU', 'User']))
//       return navigateTo('/');

//     },
//     // 'auth',
//   ],
// });

const params = {};
params._TimeZoneOffset = new Date().getTimezoneOffset();
params.sort ="created_at:desc";

const token = useCookie('token');
const { data: uad_items } = await useAsyncData(async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/api/items", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: params,
    retry: 0,
  });
  useCommonStore().loading_full = false;
  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return [];
  }
  return data.value.data;
});


const items = ref(null);
items.value = uad_items.value;

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

const inject_params = () => {
  params.like = "";
  if (search.value != "") {
    params.like = `id:%${search.value}%,name:%${search.value}%,value:%${search.value}%`;
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
  if(params.first_row) delete params.first_row;
  if(params.page > 1){
    params.first_row = JSON.stringify(items.value[0]);
  }
  const { data, error, status } = await useMyFetch("/api/items", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: params,
    retry: 0,
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

const router = useRouter();

const tabs_form = () => markRaw(defineAsyncComponent(() => import('~/tabs/data_item/form.vue')));

const form_add = async() => {
  await useCommonStore().setDynamicComponent(tabs_form,"Tambah Item");

  // router.push({ name: 'data_item-form', query: { id: "" } });
}

const { display } = useAlertStore();
const { show, status, message } = storeToRefs(useAlertStore());

const form_edit = async() => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    await useCommonStore().setDynamicComponent(tabs_form,"Ubah Item",{id: items.value[selected.value].id});
    // router.push({ name: 'data_item-form', query: { id: items.value[selected.value].id } });
  }
};


const delete_data = ref({});
const delete_box = ref(false);

const toggleDeleteBox = async()=>{  
  if (delete_box.value) {
    delete_box.value = false;
  }
};

const remove = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    delete_data.value = {id : items.value[selected.value].id};
    delete_box.value = true;
  }
};

const confirmed_delete = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("id", items.value[selected.value].id);  
  data_in.append("_method", "DELETE");

  const { data, error, status } = await useMyFetch("/api/item", {
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
  items.value.splice(selected.value,1);
  selected.value = -1;
  delete_box.value = false;
}

const show_box = ref(false);
const photo = ref("");
const openBox = (x)=>{
  show_box.value = true;
  photo.value = x;
}
</script>