<template>
  <div class="w-full h-full flex flex-col">
    <HeaderCustom :title="'Form Item'" :back="true" />
    <div class="w-full flex grow flex-col h-0 overflow-auto bg-white">
      <div class="w-full align-items-center justify-content-center grow overflow-auto">
        <!-- <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Name</label>
          <input class="w-full border-black border-solid border-2 p-1" type="text" v-model="item.name">
          <p class="text-red-500">{{ field_errors.name }}</p>
        </div> -->
        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Type</label>
          <select class="w-full border-black border-solid border-2 p-1" v-model="transaction.type">
            <option value="used">Used</option>
            <option value="in">In</option>
            <option value="transfer">Transfer</option>
          </select>
          <p class="text-red-500">{{ field_errors.type }}</p>
        </div>
        <!-- <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Name</label>
          <input class="w-full border-black border-solid border-2 p-1" type="text" v-model="item.name">
          <p class="text-red-500">{{ field_errors.name }}</p>
        </div> -->

        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">From Warehouse</label>
          <div class="w-full flex flex-row flex-wrap border-black border-solid border-2">
            <div v-if="!transaction.warehouse || !transaction.warehouse.id" class="w-full flex">
              <button @click="searchWarehouse('from')" class="flex items-center grow">
                <IconsSearch class="text-2xl text-black" />
                <div class="flex items-center grow p-1">
                  Pilih Warehouse yang dikelola
                </div>
              </button>
            </div>
            <div v-else class="w-full flex" style="">
              <div class="flex flex-row flex-wrap grow">
                <div class="p-1">
                  <div class="text-sm text-gray-600">ID</div>
                  <div class="bold">{{ transaction.warehouse.id }}</div>
                </div>
                <div class="p-1">
                  <div class="text-sm text-gray-600">Name</div>
                  <div class="bold">{{ transaction.warehouse.name }}</div>
                </div>
              </div>
              <button class="w-10 bg-red-600 flex items-center justify-center" @click="clearWarehouse('from')">
                <IconsDelete class="text-2xl text-white" />
              </button>
            </div>
          </div>
          <p class="text-red-500">{{ field_errors.warehouse_id }}</p>
        </div>

        <div v-if="transaction.type =='transfer'" class="w-full flex flex-col flex-wrap p-1">
          <label for="">To Warehouse</label>
          <div class="w-full flex flex-row flex-wrap border-black border-solid border-2">
            <div v-if="!transaction.warehouse_target || !transaction.warehouse_target.id" class="w-full flex">
              <button @click="searchWarehouse('to')" class="flex items-center grow">
                <IconsSearch class="text-2xl text-black" />
                <div class="flex items-center grow p-1">
                  Pilih Warehouse Target
                </div>
              </button>
            </div>
            <div v-else class="w-full flex" style="">
              <div class="flex flex-row flex-wrap grow">
                <div class="p-1">
                  <div class="text-sm text-gray-600">ID</div>
                  <div class="bold">{{ transaction.warehouse_target.id }}</div>
                </div>
                <div class="p-1">
                  <div class="text-sm text-gray-600">Name</div>
                  <div class="bold">{{ transaction.warehouse_target.name }}</div>
                </div>
              </div>
              <button class="w-10 bg-red-600 flex items-center justify-center" @click="clearWarehouse('to')">
                <IconsDelete class="text-2xl text-white" />
              </button>
            </div>
          </div>
          <p class="text-red-500">{{ field_errors.warehouse_target_id }}</p>
        </div>
        
        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Item</label>
          <div class="w-full flex flex-row flex-wrap border-black border-solid border-2">
            <div v-if="!transaction.item || !transaction.item.id" class="w-full flex">
              <button @click="searchItem()" class="flex items-center grow">
                <IconsSearch class="text-2xl text-black" />
                <div class="flex items-center grow p-1">
                  Pilih Item
                </div>
              </button>
            </div>
            <div v-else class="w-full flex" style="">
              <div class="flex flex-row flex-wrap grow">
                <div class="p-1">
                  <div class="text-sm text-gray-600">ID</div>
                  <div class="bold">{{ transaction.item.id }}</div>
                </div>
                <div class="p-1">
                  <div class="text-sm text-gray-600">Name</div>
                  <div class="bold">{{ transaction.item.name }}</div>
                </div>
                <div class="p-1">
                  <div class="text-sm text-gray-600">"Unit"</div>
                  <div class="bold">{{ transaction.item.unit.name }}</div>
                </div>
              </div>
              <button class="w-10 bg-red-600 flex items-center justify-center" @click="clearItem()">
                <IconsDelete class="text-2xl text-white" />
              </button>
            </div>
          </div>
          <p class="text-red-500">{{ field_errors.unit_id }}</p>

        </div>

        <div v-if="transaction.type=='in'" class="w-full flex flex-col flex-wrap p-1">
          <label for="">Qty In</label>
          <InputPointFormat class="w-full border-black border-solid border-2 p-1" type="text" :value="transaction.qty_in" @input="transaction.qty_in = $event"/>
          <p class="text-red-500">{{ field_errors.qty_in }}</p>
        </div>
        <div v-if="transaction.type=='transfer' || transaction.type=='used'" class="w-full flex flex-col flex-wrap p-1">
          <label for="">Qty Out</label>
          <InputPointFormat class="w-full border-black border-solid border-2 p-1" type="text" :value="transaction.qty_out" @input="transaction.qty_out = $event"/>
          <p class="text-red-500">{{ field_errors.qty_out }}</p>
        </div>
        <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">Note</label>
          <textarea class="w-full border-black border-solid border-2 p-1" v-model="transaction.note"></textarea>
          <p class="text-red-500">{{ field_errors.note }}</p>
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

  <SearchSelectItems :show="show_item" :fnClose="closeSNSItem" :fnSelect="selectSNSItem"
    :excludes="'item_had_which_item_id'" />
  
  <SearchSelectHrmRevisiLokasis :show="show_warehouse" :fnClose="closeSNSWarehouse" :fnSelect="selectSNSWarehouse"
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

let empty_warehouse = {
  id: "",
  name: "",
};
let empty_item = {
  id: "",
  name: "",
  unit:{
    id:"",
    name:""
  }
};


const { data: transaction } = await useAsyncData(async () => {
  const id = route.query.id;
  if (id !== undefined && id !== "") {
    useCommonStore().loading_full = true;
    const { data, error, status }: any = await useFetch("/api/transaction", {
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
    type: "used",
    qty_in: 0,
    qty_out: 0,
    note: "",
    warehouse: {
      ...empty_warehouse
    },
    warehouse_target: {
      ...empty_warehouse
    },
    item: {
      ...empty_item
    },
  };
});


let show_item = ref(false);

const clearItem = () => {
  transaction.value.item = { ...empty_item };
};

const searchItem = () => {
  show_item.value = true;
};

const closeSNSItem = () => {
  show_item.value = false;
};

const selectSNSItem = (item: any) => {
  transaction.value.item = item;
  show_item.value = false;
}

let show_warehouse = ref(false);
let selected_warehouse = "";
const clearWarehouse = (val) => {
  if(val=="from"){
    transaction.value.warehouse = { ...empty_warehouse };
  }else if(val =='to'){
    transaction.value.warehouse_target = { ...empty_warehouse };
  }
};

const searchWarehouse = (val) => {
  selected_warehouse = val;
  show_warehouse.value = true;
};

const closeSNSWarehouse = () => {
  show_warehouse.value = false;
};

const selectSNSWarehouse = (warehouse: any) => {
  if(selected_warehouse=='from'){
    transaction.value.warehouse = {...warehouse};
  }else if(selected_warehouse=='to'){
    transaction.value.warehouse_target = {...warehouse};
  }
  show_warehouse.value = false;
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
    "type": transaction.value.type,
    "note": transaction.value.note,
    "qty_in": transaction.value.qty_in,
    "qty_out": transaction.value.qty_out,
    "item_id": transaction.value.item.id,
    "warehouse_id": transaction.value.warehouse.id,
    "warehouse_target_id": transaction.value.warehouse_target.id,
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

  const { data, error, status }: any = await useFetch("/api/transaction", {
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