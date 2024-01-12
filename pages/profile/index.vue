<template>
    <div class="w-full h-full flex flex-col">
      <HeaderCustom :title="'Profile'" :back="true" />
      <div class="w-full flex grow flex-col h-0 overflow-auto bg-white">
        <div class="w-full align-items-center justify-content-center grow overflow-auto">
          <div class="w-full flex flex-col flex-wrap p-1">
            <label for="">Username</label>
            <input class="w-full border-black border-solid border-2 p-1" type="text" v-model="user.username">
            <p class="text-red-500">{{ field_errors.username }}</p>
          </div>
          <div class="w-full flex flex-col flex-wrap p-1">
            <label for="">Nama Identitas</label>
            <input class="w-full border-black border-solid border-2 p-1" type="text" v-model="user.fullname">
            <p class="text-red-500">{{ field_errors.fullname }}</p>
          </div>
          <div class="w-full flex flex-col flex-wrap p-1">
            <label for="">Email</label>
            <input class="w-full border-black border-solid border-2 p-1" type="text" v-model="user.email">
            <p class="text-red-500">{{ field_errors.email }}</p>
          </div>
          <div class="w-full flex flex-col flex-wrap p-1">
            <label for="">Telepon</label>
            <input class="w-full border-black border-solid border-2 p-1" type="text" v-model="user.phone_number">
            <p class="text-red-500">{{ field_errors.phone_number }}</p>
          </div>
          <div class="w-full flex flex-col flex-wrap p-1">
            <label for="">Foto</label>
            <div  class="flex justify-center items-center w-24 h-24">
                <img :src="user.photo || 'user-default.png'" alt="" class=" max-w-full max-h-full">
            </div>
            <button v-show="photo" class="bg-gray-600 w-24 text-white" @click="resetPhoto()">Remove</button>
            <input v-show="!photo" @change="changePhoto($event)" ref="photo_input" type="file" name="photo" value="">

            <small>Upload file image : jpg, jpeg</small>
            <p class="help-err">{{ field_errors.photo }}</p>
            </div>
        </div>
        <div class="w-full flex items-center justify-end">
          <button type="button" name="button" class="w-36 m-1" @click="$router.go(-1)">
            Cancel
          </button>
          <button type="button" name="button" class="w-36 m-1 bg-blue-600 text-white p-2 rounded-sm" @click="doSave()">
            Save
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { useAuthStore } from '~/store/auth';
  
  import { storeToRefs } from 'pinia';
  import { useErrorStore } from '~/store/error';
  import { useCommonStore } from '~/store/common';
  import { useAlertStore } from '~/store/alert';
  
  const { checkScopes,checkRole } = useAuthStore();
    definePageMeta({
        layout: "clear",
    });
  const photo = ref(false);

  const token = useCookie('token');
  const field_errors = ref<Record<string, any>>({})
  
  const router = useRouter();
  const route = useRoute();
  
  
  const { data: user } = await useAsyncData(async () => {
  
    useCommonStore().loading_full = true;
      const { data, error, status }: any = await useMyFetch("/api/profile", {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Accept': 'application/json'
        },
        retry: 0,
      });
      useCommonStore().loading_full = false;
  
      if (status.value === 'error') {
        useErrorStore().trigger(error, field_errors);
      } else {
        if (data.value.photo) photo.value = true;
        return data.value;
      }

      return {
        username: "",
        fullname: "",
        email: "",
        phone_number: "",
        photo:""
    };
  });

const photo_input = ref<HTMLInputElement | null>(null);
const changePhoto = ($e: any) => {

  var files = $e.target.files;
  if (files.length > 0) {
    let reader = new FileReader();

    reader.onload = function (e) {
      let result = e.target?.result as string;

      if (result.match(/image/)) {
        user.value.photo = result;
      }
    }
    reader.readAsDataURL(files[0]);
    photo.value = true;
  }
};


const resetPhoto = () => {
  photo.value = false;
  user.value.photo = '';
  let elPhotoInput = photo_input.value;
  if (elPhotoInput) {
    elPhotoInput.value = "";
  }
};
  

const username = useCookie('username');
const fullname = useCookie('fullname');


  const doSave = async () => {
    useCommonStore().loading_full = true;
    field_errors.value = {};
  
    const data_in = new FormData();
    data_in.append("username", user.value.username);
    data_in.append("email", user.value.email);
    data_in.append("phone_number", user.value.phone_number);
    data_in.append("fullname", user.value.fullname);
    data_in.append("password", user.value.password);
    data_in.append("can_login", user.value.can_login);
    if (photo_input.value?.files)
        data_in.append("photo", photo_input.value.files[0] || '');
    if (photo_input.value)
        data_in.append("photo_preview", user.value.photo);


    let req_method: any = "post";
  
    let id = route.query.id;
    if (id === "") {
    } else {
        req_method = "post";
        // data_in['id'] = id;
        data_in.append("id", id as string);
        data_in.append("_method", "PUT");
    }
  
    const { data, error, status }: any = await useMyFetch("/api/update_profile", {
      method: req_method,
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
    }else{
        username.value = user.value.username;
        fullname.value = user.value.fullname;

        useAlertStore().display({
            show: true,
            status: "Success",
            message: data.value.message
        })
    }


    // router.go(-1);
  }
  
  
  </script>