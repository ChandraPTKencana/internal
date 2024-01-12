<template>
  <div class="w-full h-full flex flex-col">
    <HeaderCustom :title="'Form Member'" :back="true" />
    <div class="w-full flex grow flex-col h-0 overflow-auto bg-white">
      <div class="w-full align-items-center justify-content-center grow overflow-auto">
        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Username</label>
          <input class="w-full border-black border-solid border-2 p-1" type="text" v-model="member.username">
          <p class="text-red-500">{{ field_errors.username }}</p>
        </div>
        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Email</label>
          <input class="w-full border-black border-solid border-2 p-1" type="text" v-model="member.email">
          <p class="text-red-500">{{ field_errors.email }}</p>
        </div>
        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Phone Number</label>
          <input class="w-full border-black border-solid border-2 p-1" type="text" v-model="member.phone_number">
          <p class="text-red-500">{{ field_errors.phone_number }}</p>
        </div>
        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Fullname</label>
          <input class="w-full border-black border-solid border-2 p-1" type="text" v-model="member.fullname">
          <p class="text-red-500">{{ field_errors.fullname }}</p>
        </div>
        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Password</label>
          <input class="w-full border-black border-solid border-2 p-1" type="password" v-model="member.password">
          <p class="text-red-500">{{ field_errors.password }}</p>
        </div>
        <!-- <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Active Until</label>
          <ClientOnly>
            <vue-date-picker class="border-black border-solid border-2" v-model="member.active_until" text-input
              teleport-center></vue-date-picker>
          </ClientOnly>
          <p class="text-red-500">{{ field_errors.active_until }}</p>
        </div> -->

        <!-- <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Marketer</label>
          <div class="w-full flex flex-row flex-wrap border-black border-solid border-2">
            <div v-if="!member.internal_marketer || !member.internal_marketer.id" class="w-full flex">
              <button @click="searchMarketer()" class="flex items-center grow">
                <IconsSearch class="text-2xl text-black" />
                <div class="flex items-center grow p-1">
                  Pilih Karyawan
                </div>
              </button>
            </div>
            <div v-else class="w-full flex" style="">
              <div class="flex flex-row flex-wrap grow">
                <div class="p-1">
                  <div class="text-sm text-gray-600">ID</div>
                  <div class="bold">{{ member.internal_marketer.id }}</div>
                </div>
                <div class="p-1">
                  <div class="text-sm text-gray-600">Username</div>
                  <div class="bold">{{ member.internal_marketer.email }}</div>
                </div>
              </div>
              <button class="w-10 bg-red-600 flex items-center justify-center" @click="clearMarketer()">
                <IconsDelete class="text-2xl text-white" />
              </button>
            </div>
          </div>
          <p class="text-red-500">{{ field_errors.internal_marketer_id }}</p>

        </div> -->
        <!-- <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Role</label>
          <select class="w-full border-black border-solid border-2 p-1" v-model="member.role">
            <option value="Operator">Operator</option>
            <option value="Admin">Admin</option>
            <option value="Super_Admin">Super Admin</option>
          </select>
          <p class="text-red-500">{{ field_errors.role }}</p>
        </div> -->
        <!-- <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Foto {{ member.photo }}</label>
          <div class="flex justify-center items-center w-24 h-24">
            <img :src="member.photo" alt="" class=" max-w-full max-h-full">
          </div>
          <button v-show="photo" class="bg-gray-600" @click="resetPhoto()">Remove Avatar</button>
          <input v-show="!photo" @change="changePhoto($event)" ref="photo_input" type="file" name="photo" value="">

          <small>Upload file image : jpg, jpeg</small>
          <p class="help-err">{{ field_errors.photo }}</p>
        </div> -->
        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Izinkan Masuk?</label>
          <select class="w-full border-black border-solid border-2 p-1" v-model="member.can_login">
            <option value="1">Ya</option>
            <option value="0">Tidak</option>
          </select>
          <p class="text-red-500">{{ field_errors.can_login }}</p>
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

import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';

const { checkScopes,checkRole } = useAuthStore();
definePageMeta({
  layout: "clear",
  middleware: [
    function (route) {
      
      // if (!useAuthStore().checkScopes(['ap-member-add', 'ap-member-edit']))
      //   return navigateTo('/');
      if (!useAuthStore().checkRole(["Super Admin","ClientPabrik", 'User']))
      return navigateTo('/');
    },
    // 'auth',
  ],
});
const token = useCookie('token');
const field_errors = ref<Record<string, any>>({})

const router = useRouter();
const route = useRoute();

// let emptyMarketer = {
//   id: "",
//   email: "",
//   fullname: ""
// };
const photo = ref(false);

const { data: member } = await useAsyncData(async () => {
  const id = route.query.id;
  if (id !== undefined && id !== "") {
    useCommonStore().loading_full = true;
    const { data, error, status }: any = await useMyFetch("/api/member", {
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
      if (data.value.data.photo) photo.value = true;
      return data.value.data;
    }
  }
  return {
    id: -1,
    username: "",
    email: "",
    phone_number: "",
    fullname: "",
    password: "",
    can_login: '0',
    photo: ""
    // internal_marketer: {
    //   ...emptyMarketer
    // }
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
        member.value.photo = result;
      }
    }
    reader.readAsDataURL(files[0]);
    photo.value = true;
  }
};


const resetPhoto = () => {
  photo.value = false;
  member.value.photo = '';
  let elPhotoInput = photo_input.value;
  if (elPhotoInput) {
    elPhotoInput.value = "";
  }
};


const doSave = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("username", member.value.username);
  data_in.append("email", member.value.email);
  data_in.append("phone_number", member.value.phone_number);
  data_in.append("fullname", member.value.fullname);
  data_in.append("password", member.value.password);
  data_in.append("can_login", member.value.can_login);
  if (photo_input.value?.files)
    data_in.append("photo", photo_input.value.files[0] || '');
  if (photo_input.value)
    data_in.append("photo_preview", member.value.photo);


  // let data_in: Record<string, any> = {
  //   "username": member.value.username,
  //   "email": member.value.email,
  //   "fullname": member.value.fullname,
  //   "password": member.value.password,
  //   "can_login": member.value.can_login,
  // };
  let $method: any = "post";

  let id = route.query.id as string;
  if (id === "") {
  } else {
    $method = "post";
    // data_in['id'] = id;
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status }: any = await useMyFetch("/api/member", {
    method: $method,
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json',
    },
    body: data_in,
    retry: 0,
  });
  useCommonStore().loading_full = false;
  if (status.value === 'error') {
    useErrorStore().trigger(error, field_errors);
    return;
  }
  router.go(-1);
}


</script>