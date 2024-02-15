<template>
  <div class="w-full h-full flex flex-col">
    <HeaderCustom :title="'Form Item'" :back="true" />
    <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
      <div class="w-full align-items-center justify-content-center grow overflow-auto">
        <div class="w-full flex flex-col flex-wrap p-1">
            <label for="">Foto</label>
            <div  class="flex justify-center items-center w-24 h-24">
                <img :src="item.photo || '/stok/user-default.png'" alt="" class=" max-w-full max-h-full">
            </div>
            <button type="button" v-show="photo" class="bg-gray-600 w-24 text-white" @click="resetPhoto()">Remove</button>
            <input v-show="!photo" @change="changePhoto($event)" ref="photo_input" type="file" name="photo" value="">

            <small>Upload file image : jpg, jpeg</small>
            <p class="help-err">{{ field_errors.photo }}</p>
            </div>
        
        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Name</label>
          <input class="" type="text" v-model="item.name">
          <p class="text-red-500">{{ field_errors.name }}</p>
        </div>
        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Value</label>
          <InputPointFormat class="" type="text" :value="item.value" @input="item.value = $event"/>
          <p class="text-red-500">{{ field_errors.value }}</p>
        </div>
        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Note</label>
          <textarea class="" v-model="item.note"></textarea>
          <p class="text-red-500">{{ field_errors.note }}</p>
        </div>
        
        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Unit</label>
          <div class="card-border flex flex-row flex-wrap">
            <div v-if="!item.unit || !item.unit.id" class="w-full flex">
              <button type="button" @click="searchUnit()" class="flex items-center grow">
                <IconsSearch class="text-2xl text-black" />
                <div class="flex items-center grow p-1">
                  Pilih Unit
                </div>
              </button>
            </div>
            <div v-else class="w-full flex" style="">
              <div class="flex flex-row flex-wrap grow">
                <div class="p-1">
                  <div class="text-sm text-gray-600">ID</div>
                  <div class="bold">{{ item.unit.id }}</div>
                </div>
                <div class="p-1">
                  <div class="text-sm text-gray-600">Email</div>
                  <div class="bold">{{ item.unit.name }}</div>
                </div>
              </div>
              <button type="button" class="w-10 bg-red-600 flex items-center justify-center" @click="clearUnit()">
                <IconsDelete class="text-2xl text-white" />
              </button>
            </div>
          </div>
          <p class="text-red-500">{{ field_errors.unit_id }}</p>

        </div>
        

      </div>
      <div class="w-full flex items-center justify-end">
        <button type="button" name="button" class="w-36 m-1" @click="$router.go(-1)">
          Cancel
        </button>
        <button type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white rounded-sm" @click.prevent="doSave()">
          Save
        </button>
      </div>
    </form>
  </div>

  <!-- <SearchSelectUsers /> -->

  <SearchSelectUnits :show="show_unit" :fnClose="closeSNSUnit" :fnSelect="selectSNSUnit"
    :excludes="'item_had_which_item_id'" />
</template>

<script lang="ts" setup>
import { useAuthStore } from '~/store/auth';

import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';

const { checkScopes,checkRole } = useAuthStore();
definePageMeta({
  layout: "clear",
  middleware: [
    function (to, from) {
      // if (!useAuthStore().checkScopes(['ap-item-add', 'ap-item-edit']))
      //   return navigateTo('/');
      if (!useAuthStore().checkRole(["Super Admin","ClientPabrik",'KTU', 'User']))
      return navigateTo('/');
      useCommonStore().loading_full = false;
    },
    // 'auth',
  ],
});
const token = useCookie('token');
const field_errors = ref<Record<string, any>>({})

const router = useRouter();
const route = useRoute();

let empty_unit = {
  id: "",
  name: "",
};

const photo = ref(false);


const { data: item } = await useAsyncData(async () => {
  const id = route.query.id;
  if (id !== undefined && id !== "") {
    useCommonStore().loading_full = true;
    const { data, error, status }: any = await useMyFetch("/api/item", {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json'
      },
      params: { id },
      retry: 0,
    });
    useCommonStore().loading_full = false;

    if (status.value === 'error') {
      useErrorStore().trigger(error, field_errors);
    } else {
      let data_get = data.value.data;
      // console.log(data.value.data)
      if (data.value.data.photo) photo.value = true;
      // if (data_get.members.length > 0) {
      //   data_get["operator_member"] = data_get.members[0];
      // } else {
      //   data_get["operator_member"] = { ...emptyOperatorMember };
      // }      
      return data_get;
    }
  }
  return {
    id: -1,
    name: "",
    value: 0,
    note: "",
    unit: {
      ...empty_unit
    },
    photo:""
  };
});


let show_unit = ref(false);


const clearUnit = () => {
  item.value.unit = { ...empty_unit };
};

const searchUnit = () => {
  show_unit.value = true;
};

const closeSNSUnit = () => {
  show_unit.value = false;
};

const selectSNSUnit = (unit: any) => {
  item.value.unit = unit;
  show_unit.value = false;
}


const doSave = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  // const data_in = new FormData();
  // data_in.append("name", item.value.name);
  // data_in.append("password", item.value.password);
  // data_in.append("fullname", item.value.fullname);
  // data_in.append("role", item.value.role);
  // data_in.append("can_login", item.value.can_login);
  const data_in= new FormData();
  data_in.append("name", item.value.name);
  data_in.append("value", item.value.value);
  data_in.append("note", item.value.note);
  data_in.append("unit_id", item.value.unit.id);
  if (photo_input.value?.files)
      data_in.append("photo", photo_input.value.files[0] || '');
  if (photo_input.value)
      data_in.append("photo_preview", item.value.photo);

  
 
  let $method: any = "post";

  let id = route.query.id;
  if (id === "") {
  } else {
    $method = "post";
    data_in.append("id", id as string);
    data_in.append("_method", "PUT");
  }

  const { data, error, status }: any = await useMyFetch("/api/item", {
    method: $method,
    headers: {
      'Authorization': `Bearer ${token.value}`,
      // 'Content-Type': 'application/json',
      'Accept': 'application/json',
      // "Content-Type": "multipart/form-data",
    },
    body: data_in,
    retry: 0,
    // server: true
  });
  useCommonStore().loading_full = false;
  if (status.value === 'error') {
    useErrorStore().trigger(error, field_errors);
    return;
  }
  router.go(-1);
}


const photo_input = ref<HTMLInputElement | null>(null);

const changePhoto = ($e: any) => {

var files = $e.target.files;
if (files.length > 0) {
  let reader = new FileReader();

  reader.onload = function (e) {
    let result = e.target?.result as string;

    if (result.match(/image/)) {
      item.value.photo = result;
    }
  }
  reader.readAsDataURL(files[0]);
  photo.value = true;
}
};


const resetPhoto = () => {
photo.value = false;
item.value.photo = '';
let elPhotoInput = photo_input.value;
if (elPhotoInput) {
  elPhotoInput.value = "";
}
};
</script>