<template>
  <div class="w-full h-full flex flex-col">
    <HeaderCustom :title="'Form User'" :back="true" />
    <div class="w-full flex grow flex-col h-0 overflow-auto bg-white">
      <div class="w-full align-items-center justify-content-center grow overflow-auto">
        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Email</label>
          <input class="w-full border-black border-solid border-2 p-1" type="text" v-model="user.email">
          <p class="text-red-500">{{ field_errors.email }}</p>
        </div>
        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Nama Identitas</label>
          <input class="w-full border-black border-solid border-2 p-1" type="text" v-model="user.fullname">
          <p class="text-red-500">{{ field_errors.fullname }}</p>
        </div>
        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Kata Sandi</label>
          <input class="w-full border-black border-solid border-2 p-1" type="password" v-model="user.password">
          <p class="text-red-500">{{ field_errors.password }}</p>
        </div>
        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Jabatan</label>
          <select class="w-full border-black border-solid border-2 p-1" v-model="user.role">
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Marketing">Marketing</option>
            <option value="Super_Admin">Super Admin</option>
          </select>
          <p class="text-red-500">{{ field_errors.role }}</p>
        </div>
        <div class="w-full flex" style="flex-flow:column wrap; padding:4px;">
          <label for="">Izinkan Masuk?</label>
          <select class="w-full border-black border-solid border-2 p-1" v-model="user.can_login">
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

import { storeToRefs } from 'pinia';
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';

const { checkScopes } = useAuthStore();
definePageMeta({
  layout: "clear",
  middleware: [
    function (to, from) {
      if (!useAuthStore().checkScopes(['ap-user-add', 'ap-user-edit']))
        return navigateTo('/');
    },
    // 'auth',
  ],
});
const token = useCookie('token');
const field_errors = ref<Record<string, any>>({})

// const isPermitRole = ref(false);
const router = useRouter();
const route = useRoute();

// const tesScopes = computed((arr) => { return checkScopes(arr) });

const { data: user } = await useAsyncData(async () => {
  // isPermitRole.value = checkScopes(['dp-user-manage-role']);
  // isPermitRole.value = checkScopes(['ap-user-manage-role']);
  const id = route.query.id;

  if (id !== undefined && id !== "") {
    useCommonStore().loading_full = true;
    const { data, error, status }: any = await useFetch("/api/internal/user", {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        // 'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      params: { id },
      // body: {
      //   sort: "updated_at:desc"
      // },
      retry: 0,
      // server: true
    });
    useCommonStore().loading_full = false;

    if (status.value === 'error') {
      useErrorStore().trigger(error, field_errors);
    } else {
      return data.value.data;
    }
  }
  return {
    id: -1,
    email: "",
    fullname: "",
    password: "",
    role: "User",
    can_login: '0'
  };
});

const doSave = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  // const data_in = new FormData();
  // data_in.append("email", user.value.email);
  // data_in.append("password", user.value.password);
  // data_in.append("fullname", user.value.fullname);
  // data_in.append("role", user.value.role);
  // data_in.append("can_login", user.value.can_login);

  let data_in: Record<string, any> = {
    "email": user.value.email,
    "password": user.value.password,
    "fullname": user.value.fullname,
    "role": user.value.role,
    "can_login": user.value.can_login,
  };
  let req_method: any = "post";

  let id = route.query.id;
  if (id === "") {
  } else {
    req_method = "put";
    data_in['id'] = id;
    // data_in.append("id", id);
    // data_in.append("_method", "PUT");
  }

  const { data, error, status }: any = await useFetch("http://127.0.0.1:8000/api/internal/user", {
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
  }
  router.go(-1);
}


</script>