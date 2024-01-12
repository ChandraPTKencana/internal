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
          <label for="">Value</label>
          <InputPointFormat class="w-full border-black border-solid border-2 p-1" type="text" :value="item.value" @input="item.value = $event"/>
          <p class="text-red-500">{{ field_errors.value }}</p>
        </div>
        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Note</label>
          <textarea class="w-full border-black border-solid border-2 p-1" v-model="item.note"></textarea>
          <p class="text-red-500">{{ field_errors.note }}</p>
        </div>
        
        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Unit</label>
          <div class="w-full flex flex-row flex-wrap border-black border-solid border-2">
            <div v-if="!item.unit || !item.unit.id" class="w-full flex">
              <button @click="searchUnit()" class="flex items-center grow">
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
              <button class="w-10 bg-red-600 flex items-center justify-center" @click="clearUnit()">
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
        <button type="button" name="button" class="w-36 m-1 bg-blue-600 text-white p-2 rounded-sm" @click="doSave()">
          Save
        </button>
      </div>
    </div>
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

let empty_unit = {
  id: "",
  name: "",
};


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
  let data_in: Record<string, any> = {
    "name": item.value.name,
    "value": item.value.value,
    "note": item.value.note,
    "unit_id": item.value.unit.id,
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


</script>