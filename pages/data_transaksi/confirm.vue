<template>
  <div class="w-full h-full flex flex-col">
    <HeaderCustom :title="'Form Confirmation'" :back="true" />
    <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
      <div class="w-full flex flex-col items-center justify-center grow overflow-auto">
        <div class="w-full flex flex-row flex-wrap">

          <div v-if="transaction.confirmed_by" class="w-full flex flex-col flex-wrap p-1">
            <label for="">Input At</label>
            <div class="card-border"> {{ $moment(transaction.input_at).format("DD-MM-Y") }}</div>
          </div>

          <div class="w-full flex flex-col flex-wrap p-1">
            <label for="">Type</label>
            <div class="card-border"> {{ transaction.type }}</div>
            <p class="text-red-500">{{ field_errors.type }}</p>
          </div>
  
          <div class="w-full flex flex-col flex-wrap p-1">
            <label for="">From Warehouse</label>
            <div class="card-border flex flex-row flex-wrap">
              <div class="w-full flex" style="">
                <div class="flex flex-row flex-wrap grow">
                  <div class="p-1">
                    <div class="text-sm text-gray-600">ID</div>
                    <div class="bold">{{ transaction.ref_id ? transaction.warehouse_source.id : transaction.warehouse.id }}</div>
                  </div>
                  <div class="p-1">
                    <div class="text-sm text-gray-600">Name</div>
                    <div class="bold">{{ transaction.ref_id ? transaction.warehouse_source.name :  transaction.warehouse.name }}</div>
                  </div>
                </div>
                
              </div>
            </div>
            <p class="text-red-500">{{ field_errors.warehouse_id }}</p>
          </div>
  
          <div v-if="transaction.type =='transfer'" class="w-full flex flex-col flex-wrap p-1">
            <label for="">To Warehouse</label>
            <div class="card-border flex flex-row flex-wrap ">
              <div class="w-full flex" style="">
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
                
              </div>
            </div>
            <p class="text-red-500">{{ field_errors.warehouse_target_id }}</p>
          </div>
          
          
          <div v-if="transaction.note" class="w-full flex flex-col flex-wrap p-1">
            <label for="">Note</label>
            <div class="card-border">{{ transaction.note }}</div>
            <p class="text-red-500">{{ field_errors.note }}</p>
          </div>
        </div>
        
        <div class="w-full flex grow p-1 overflow-auto">
          <div role="sticky" ref="loadRef">
            <table class="tacky w-full" style="white-space:normal;">
              <thead >
                <tr class="sticky top-0 !z-[2]">
                  <th class="min-w-[50px] !w-[50px] max-w-[50px] ">No</th>
                  <th class="min-w-[50px] !w-[50px] max-w-[50px] ">ID Item</th>
                  <th>Nama Item</th>
                  <th class="min-w-[80px] !w-[80px] max-w-[80px]">Qty In</th>
                  <th class="min-w-[80px] !w-[80px] max-w-[80px]">Qty Out</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(detail, index) in details" :key="index">
                  <tr >
                    
                    <td>{{ index + 1 }}.</td>
                    <td class="cell bold" :class="detail.confirm_by ? 'unselectable' : ''">
                      <div class="w-full h-full flex items-center justify-center">
                        {{ detail.item.id }}
                      </div>
                    </td>
                    <td class="cell" :class="detail.confirm_by ? 'unselectable' : ''">
                      <div class="w-full h-full flex items-center justify-center">
                        {{ detail.item.name }}
                      </div>
                    </td>
                    <td class="cell" :class="detail.confirm_by ? 'unselectable' : ''">
                      <div class="w-full h-full flex items-center justify-center">
                        {{ detail.qty_in }}
                      </div>
                    </td>
                    <td class="cell">
                      <div class="w-full h-full flex items-center justify-center">
                        {{ detail.qty_out }}
                      </div>
                    </td>
                    <td class="cell">
                      <div class="w-full h-full flex items-center justify-center">
                        {{ detail.note }}
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
        

      </div>
      
      <div class="w-full flex items-center justify-end">
        <button type="button" name="button" class="w-36 m-1" @click="$router.go(-1)">
          Cancel
        </button>
        <button v-if="transaction.confirmed_by==null" type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white rounded-sm" @click.prevent="confirm()">
          Confirm
        </button>
      </div>
    </form>
  </div>

  <PopupMini :type="'custome'" :show="confirm_box" :data="confirm_data" :fnClose="togglePopupMiniBox" :fnConfirm="confirmOk" :enabledOk="enabledOk">
    <template #words>
      Data akan diproses dan <b>tidak dapat dikembalikan lagi</b>, yakin untuk melanjutkan ?
    </template>
    <template #footer>
      Pilih Tanggal Transaksi:
      <div class="grow mb-5" >
        <ClientOnly>
          <vue-date-picker  v-model="filter_date.to" 
          type="datetime" 
          format="dd-MM-yyyy"
          :enable-time-picker = "false" 
          text-input
          teleport-center @open="isOpened()" @closed="isClosed()"></vue-date-picker>
        </ClientOnly>
      </div>
    </template>
  </PopupMini>

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


const { data: dt_async } = await useAsyncData(async () => {
  const id = route.query.id;
  
  let transaction:any = null;
  let details:any = null;

  if (id !== undefined && id !== "") {
    useCommonStore().loading_full = true;
    const { data, error, status }: any = await useMyFetch("/api/transaction", {
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
      transaction = data.value.data;
      details = data.value.data.details.map((x:any)=>{
        x["status"]= "View";
        x["key"] = x["ordinal"];
        return x;
      });

    }
  }
  return {transaction,details};
    
});


const enabledOk = ref(true);

const isOpened=()=>{
  enabledOk.value = false;
}

const isClosed=()=>{
  enabledOk.value = true;
}

const transaction:any = ref(dt_async.value?.transaction || {
    id: -1,
    type: "used",
    note: "",
    warehouse: {
      ...empty_warehouse
    },
    warehouse_target: {
      ...empty_warehouse
    },
    details: []
  });

const details = ref(dt_async.value?.details || []);

// console.log(details.value,"d");
// const details = ref<Record<any, any>>([]);
const detail = ref({
  ordinal:0,
  item:{
    id:"",
    name:"",
    unit:{
      id:"",
      name:"",
    }
  },
  item_id:"",
  qty_in:0,
  qty_out:0,
  note:"",
  status:""
});

const filter_date = ref({
  from:"",
  to:new Date(),
});

const confirm_data = ref({});
const confirm_box = ref(false);

const confirm = () => {
  confirm_data.value = {
      id : transaction.value.id,
      type:transaction.value.type,
      // source : transaction.value.warehouse.name,
      target : transaction.value.warehouse_target.name,
      // "qty in" : transaction.value.qty_in,
    };
    confirm_box.value = true;
};

const togglePopupMiniBox = async()=>{  
  if (confirm_box.value) {
    confirm_box.value = false;
  }
};

const confirmOk = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  let data_in: Record<string, any> = {};
  data_in['to'] = filter_date.value.to;
  
  let $method: any = "post";

  let id = route.query.id;
  if (id === "") {
  } else {
    $method = "put";
    data_in['id'] = id;
    // data_in.append("id", id);
    // data_in.append("_method", "PUT");
  }

  const { data, error, status }: any = await useMyFetch("/api/confirm_transaction", {
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