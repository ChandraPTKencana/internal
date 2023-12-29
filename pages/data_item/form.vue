<template>
  <div class="w-full h-full flex flex-col">
    <HeaderCustom :title="'Form Item'" :back="true" />
    <div class="w-full flex grow flex-col h-0 overflow-auto bg-white">
      <div class="w-full align-items-center justify-content-center grow overflow-auto">
        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Name</label>
          <input class="w-full border-black border-solid border-2 p-1" type="text" v-model="item.name">
          <p class="text-red-500">{{ field_errors.name }}</p>
        </div>
        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Address</label>
          <textarea class="w-full border-black border-solid border-2 p-1" v-model="item.address"></textarea>
          <p class="text-red-500">{{ field_errors.address }}</p>
        </div>
        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Contact Number</label>
          <input class="w-full border-black border-solid border-2 p-1" type="text" v-model="item.contact_number">
          <p class="text-red-500">{{ field_errors.contact_number }}</p>
        </div>
        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Contact Person</label>
          <input class="w-full border-black border-solid border-2 p-1" type="text" v-model="item.contact_person">
          <p class="text-red-500">{{ field_errors.contact_person }}</p>
        </div>
        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Active Until</label>
          <!-- <input class="w-full border-black border-solid border-2 p-1" type="text" v-model="item.active_until"> -->
          <ClientOnly>
            <vue-date-picker class="border-black border-solid border-2" v-model="item.active_until" text-input
              teleport-center></vue-date-picker>
          </ClientOnly>
          <p class="text-red-500">{{ field_errors.active_until }}</p>
        </div>

        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Marketer</label>
          <div class="w-full flex flex-row flex-wrap border-black border-solid border-2">
            <div v-if="!item.internal_marketer || !item.internal_marketer.id" class="w-full flex">
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
                  <div class="bold">{{ item.internal_marketer.id }}</div>
                </div>
                <div class="p-1">
                  <div class="text-sm text-gray-600">Email</div>
                  <div class="bold">{{ item.internal_marketer.email }}</div>
                </div>
              </div>
              <button class="w-10 bg-red-600 flex items-center justify-center" @click="clearMarketer()">
                <IconsDelete class="text-2xl text-white" />
              </button>
            </div>
          </div>
          <p class="text-red-500">{{ field_errors.internal_marketer_id }}</p>

        </div>
        <!-- <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Jabatan</label>
          <select class="w-full border-black border-solid border-2 p-1" v-model="item.role">
            <option value="Item">Item</option>
            <option value="Admin">Admin</option>
            <option value="Super_Admin">Super Admin</option>
          </select>
          <p class="text-red-500">{{ field_errors.role }}</p>
        </div> -->
        <!-- <div class="w-full flex" style="flex-flow:column wrap; padding:4px;">
          <label for="">Izinkan Masuk?</label>
          <select class="w-full border-black border-solid border-2 p-1" v-model="item.can_login">
            <option value="1">Ya</option>
            <option value="0">Tidak</option>
          </select>
          <p class="text-red-500">{{ field_errors.can_login }}</p>
        </div> -->

        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Operator</label>
          <div class="w-full flex flex-row flex-wrap border-black border-solid border-2">
            <div v-if="!item.operator_member || item.operator_member.id == ''" class="w-full flex">
              <button @click="searchOperatorMember()" class="flex items-center grow">
                <IconsSearch class="text-2xl text-black" />
                <div class="flex items-center grow p-1">
                  Pilih Member
                </div>
              </button>
            </div>
            <div v-else class="w-full flex" style="">
              <div class="flex flex-row flex-wrap grow">
                <div class="p-1">
                  <div class="text-sm text-gray-600">ID</div>
                  <div class="bold">{{ item.operator_member.id }}</div>
                </div>
                <div class="p-1">
                  <div class="text-sm text-gray-600">Username</div>
                  <div class="bold">{{ item.operator_member.username }}</div>
                </div>
              </div>
              <button class="w-10 bg-red-600 flex items-center justify-center" @click="clearOperatorMember()">
                <IconsDelete class="text-2xl text-white" />
              </button>
            </div>
          </div>
          <p class="text-red-500">{{ field_errors.operator_member_id }}</p>

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

  <!-- <SearchSelectUsers /> -->

  <SearchSelectUsers :show="show_internal_marketer" :fnClose="closeSNSMarketer" :fnSelect="selectSNSMarketer"
    :excludes="'item_had_which_item_id'" />

  <SearchSelectMembers :show="show_operator_member" :fnClose="closeSNSOperatorMember"
    :fnSelect="selectSNSOperatorMember" />
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
      if (!useAuthStore().checkRole(["ClientPabrik", 'User']))
      return navigateTo('/');

    },
    // 'auth',
  ],
});
const token = useCookie('token');
const field_errors = ref<Record<string, any>>({})

const router = useRouter();
const route = useRoute();

let emptyMarketer = {
  id: "",
  email: "",
  fullname: ""
};

let emptyOperatorMember = {
  id: "",
  username: "",
  email: "",
  fullname: ""
};

const { data: item } = await useAsyncData(async () => {
  const id = route.query.id;
  if (id !== undefined && id !== "") {
    useCommonStore().loading_full = true;
    const { data, error, status }: any = await useFetch("/api/item", {
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
      if (data_get.members.length > 0) {
        data_get["operator_member"] = data_get.members[0];
      } else {
        data_get["operator_member"] = { ...emptyOperatorMember };
      }
      return data_get;
    }
  }
  return {
    id: -1,
    email: "",
    fullname: "",
    password: "",
    role: "Item",
    can_login: '0',
    internal_marketer: {
      ...emptyMarketer
    },
    operator_member: {
      ...emptyOperatorMember
    }
  };
});


let show_internal_marketer = ref(false);


const clearMarketer = () => {
  item.value.internal_marketer = { ...emptyMarketer };
};

const searchMarketer = () => {
  show_internal_marketer.value = true;
};

const closeSNSMarketer = () => {
  show_internal_marketer.value = false;
};

const selectSNSMarketer = (internal_marketer: any) => {
  item.value.internal_marketer = internal_marketer;
  show_internal_marketer.value = false;
}



let show_operator_member = ref(false);


const clearOperatorMember = () => {
  item.value.operator_member = { ...emptyOperatorMember };
};

const searchOperatorMember = () => {
  show_operator_member.value = true;
};

const closeSNSOperatorMember = () => {
  show_operator_member.value = false;
};

const selectSNSOperatorMember = (operator_member: any) => {
  item.value.operator_member = operator_member;
  show_operator_member.value = false;
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

  let data_in: Record<string, any> = {
    "name": item.value.name,
    "address": item.value.address,
    "contact_number": item.value.contact_number,
    "contact_person": item.value.contact_person,
    "internal_marketer_id": item.value.internal_marketer.id,
    "operator_member_id": item.value.operator_member.id,
  };
  let $method: any = "post";

  let id = route.query.id;
  if (id === "") {
  } else {
    $method = "put";
    data_in['id'] = id;
    // data_in.append("id", id);
    // data_in.append("_method", "PUT");
  }

  const { data, error, status }: any = await useFetch("/api/item", {
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


</script>