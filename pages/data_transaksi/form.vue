<template>
  <div class="w-full h-full flex flex-col">
    <HeaderCustom :title="'Form Item'" :back="true" />
    <div class="w-full flex grow flex-col h-0 overflow-auto bg-white">
      <div class="w-full flex flex-col items-center justify-center grow overflow-auto">
        <div class="w-full flex flex-row flex-wrap">

          <div class="w-full flex flex-col flex-wrap p-1">
            <label for="">Type</label>
            <select :disabled="disabled" class="" v-model="transaction.type">
              <option value="used">Used</option>
              <option value="in">In</option>
              <option value="transfer">Transfer</option>
            </select>
            <p class="text-red-500">{{ field_errors.type }}</p>
          </div>
  
          <div class="w-full flex flex-col flex-wrap p-1">
            <label for="">From Warehouse</label>
            <div class="card-border flex flex-row flex-wrap ">
              <div v-if="!transaction.warehouse || !transaction.warehouse.id" class="w-full flex">
                <button @click="searchWarehouse('from')" class="flex items-center grow">
                  <IconsSearch class="text-2xl text-black" />
                  <div class="flex items-center grow p-1">
                    Pilih Warehouse yang dikelola
                  </div>
                </button>
              </div>
              <div v-else-if="transaction.ref_id==null" class="w-full flex" :class="disabled ? 'unselectable' : ''" style="">
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
                <button v-if="!disabled" class="w-10 bg-red-600 flex items-center justify-center" @click="clearWarehouse('from')">
                  <IconsDelete class="text-2xl text-white" />
                </button>
              </div>
              <div v-else-if="transaction.ref_id!=null" class="w-full flex" :class="disabled ? 'unselectable' : ''" style="">
                <div class="flex flex-row flex-wrap grow">
                  <div class="p-1">
                    <div class="text-sm text-gray-600">ID</div>
                    <div class="bold">{{ transaction.warehouse_source.id }}</div>
                  </div>
                  <div class="p-1">
                    <div class="text-sm text-gray-600">Name</div>
                    <div class="bold">{{ transaction.warehouse_source.name }}</div>
                  </div>
                </div>
                <button v-if="!disabled" class="w-10 bg-red-600 flex items-center justify-center" @click="clearWarehouse('from')">
                  <IconsDelete class="text-2xl text-white" />
                </button>
              </div>
            </div>
            <p class="text-red-500">{{ field_errors.warehouse_id }}</p>
          </div>
  
          <div v-if="transaction.type =='transfer'" class="w-full flex flex-col flex-wrap p-1">
            <label for="">To Warehouse</label>
            <div class="card-border flex flex-row flex-wrap ">
              <div v-if="!transaction.warehouse_target || !transaction.warehouse_target.id" class="w-full flex">
                <button @click="searchWarehouse('to')" class="flex items-center grow">
                  <IconsSearch class="text-2xl text-black" />
                  <div class="flex items-center grow p-1">
                    Pilih Warehouse Target
                  </div>
                </button>
              </div>
              <div v-else class="w-full flex" :class="disabled ? 'unselectable' : ''" style="">
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
                <button v-if="!disabled" class="w-10 bg-red-600 flex items-center justify-center" @click="clearWarehouse('to')">
                  <IconsDelete class="text-2xl text-white" />
                </button>
              </div>
            </div>
            <p class="text-red-500">{{ field_errors.warehouse_target_id }}</p>
          </div>
          
          
          <div class="w-full flex flex-col flex-wrap p-1">
            <label for="">Note</label>
            <textarea :disabled="disabled" class="" v-model="transaction.note"></textarea>
            <p class="text-red-500">{{ field_errors.note }}</p>
          </div>
        </div>
        
        <div class="w-full flex grow p-1 overflow-auto">
          <div role="sticky" ref="loadRef">
            <table class="tacky w-full" style="white-space:normal;">
              <thead >
                <tr class="sticky top-0 !z-[2]">
                  <th v-if="!disabled" class="min-w-[50px] !w-[50px] max-w-[50px] "></th>
                  <th class="min-w-[50px] !w-[50px] max-w-[50px] ">No</th>
                  <th v-if="!disabled" class="min-w-[50px] !w-[50px] max-w-[50px] "></th>
                  <th class="min-w-[50px] !w-[50px] max-w-[50px] ">ID Item</th>
                  <th>Nama Item</th>
                  <th class="min-w-[80px] !w-[80px] max-w-[80px]">Qty In</th>
                  <th class="min-w-[80px] !w-[80px] max-w-[80px]">Qty Out</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(detail, index) in details" :key="index">
                  <tr v-if="detail.status!='Remove'">
                    <td v-if="!disabled" class="tools cell">
                      <div class="w-full h-full flex items-center justify-center">
                        <button  type="button" name="button"
                          @click="showAction($event, index)">
                          <IconsTools />
                        </button>
                      </div>
                    </td>
                    <td>{{ index + 1 }}.</td>
                    <td v-if="!disabled" class="cell">
                      <div class="w-full h-full flex items-center justify-center">
                        <button v-if="!detail.item_id" type="button" name="button" @click="showSNSItem($event, index)">
                          ...
                        </button>
                        <button v-else @click="deleteItem($event, index)" :disabled="detail.confirm_by">
                          <IconsTimes class=" font-bold text-2xl"/>
                        </button>
                      </div>
                    </td>
                    <td class="cell bold" :class="disabled ? 'unselectable' : ''">
                      <div class="w-full h-full flex items-center justify-center">
                        {{ detail.item.id }}
                      </div>
                    </td>
                    <td class="cell" :class="disabled ? 'unselectable' : ''">
                      <div class="w-full h-full flex items-center justify-center">
                        {{ detail.item.name }}
                      </div>
                    </td>
                    <td class="cell">
                      <div class="w-full h-full flex items-center justify-center">
                       
                        <InputPointFormat
                        :disabled="disabled || transaction.type=='used' || transaction.type=='transfer'"  
                        :key="index" class="w-full h-full border-black border-solid border-1 p-1" type="text" :value="detail.qty_in || 0" @input="detail.qty_in = $event"/>
                      </div>
                    </td>
                    <td class="cell">
                      <div class="w-full h-full flex items-center justify-center">
                        <InputPointFormat 
                        :disabled="disabled || transaction.type=='in'" 
                        :key="index" class="w-full h-full border-black border-solid border-1 p-1" type="text" :value="detail.qty_out || 0" @input="detail.qty_out = $event"/>
                      </div>
                    </td>
                    <td class="cell">
                      <div class="w-full h-full flex items-center justify-center">
                        <textarea :disabled="disabled" class="border-black border-solid border-1 p-1 w-full" v-model="detail.note" cols="7" rows="2"></textarea>
                      </div>
                    </td>
                  </tr>
                </template>
                
                <tr v-if="!disabled">
                  <td class="tools cell">
                    <button type="button" name="button" @click="addList()">
                      <IconsPlus />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        

      </div>
      
      <div class="w-full flex items-center justify-end">
        <button type="button" name="button" class="w-36 m-1 p-2" @click="$router.go(-1)">
          Cancel
        </button>
        <button v-if="!disabled" type="button" name="button" class="w-36 m-1 p-2 bg-blue-600 text-white  rounded-sm" @click="doSave()">
          Save
        </button>
      </div>
    </div>
  </div>



  <SearchSelectItems :show="show_item" :fnClose="closeSNSItem" :fnSelect="selectSNSItem"
    :exclude_lists="exclude_lists"/>
  
  <SearchSelectHrmRevisiLokasis :show="show_warehouse" :fnClose="closeSNSWarehouse" :fnSelect="selectSNSWarehouse"
  :opt="selected_warehouse" :exclude="exclude_id"/>

  <ToolsPopup :show="tools_popup" :coor="coor" :fn="closeToolsPopup" @replyAct="replyAction($event)" />

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
  let exclude_lists:any = null;
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
        x["status"]= "Edit";
        x["key"] = x["ordinal"];
        return x;
      });

      exclude_lists = data.value.data.details.map((x:any)=>{return x.item.id});  
    }
  }
  return {transaction,exclude_lists,details};
    
});

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
const exclude_lists = ref(dt_async.value?.exclude_lists || []);
const details = ref(dt_async.value?.details || []);


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

const show_item = ref(false);

const closeSNSItem = () => {
  show_item.value = false;
};

const selectSNSItem = (item: any) => {
  details.value[row.value].item = item;
  details.value[row.value].item_id = item.id;
  exclude_lists.value.push(item.id);
  show_item.value = false;
}


const showSNSItem=(e, index)=>{
  // console.log(details.value);
  row.value = index;
  // console.log(row.value,"row");
  
  show_item.value = true;
};
const deleteItem=(e, index)=>{
  let item_id = details.value[index].item.id;
  let el_index = exclude_lists.value.indexOf(item_id);
  if (el_index > -1)
    exclude_lists.value.splice(el_index, 1);

  details.value[index].item_id = "";
  details.value[index].item = {
    id: "",
    name: "",
    unit: {
      id:"",
      name:""
    }
  };
};

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
    // "qty_in": transaction.value.qty_in,
    // "qty_out": transaction.value.qty_out,
    // "item_id": transaction.value.item.id,
    "warehouse_id": transaction.value.warehouse.id,
    "warehouse_target_id": transaction.value.warehouse_target.id,
    "details":JSON.stringify(details.value)
  };
  console.log(details.value);
  
  let $method: any = "post";

  let id = route.query.id;
  if (id === "") {
  } else {
    $method = "put";
    data_in['id'] = id;
    // data_in.append("id", id);
    // data_in.append("_method", "PUT");
  }

  const { data, error, status }: any = await useMyFetch("/api/transaction", {
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

// const exclude_id = computed({
//   get(){
//     return transaction.value.warehouse?.id || transaction.value.warehouse_target?.id;
//   },
//   set(){
    
//   }
// })

const exclude_id = computed(()=>{
  return transaction.value.warehouse?.id || transaction.value.warehouse_target?.id || 0;
})


const row = ref(-1);
const tools_popup = ref(false);
const coor = ref({
  left:0,
  top:0
});


const showAction=(e, index)=>{
  row.value = index;
  tools_popup.value = true;
  coor.value = { left: e.clientX, top: e.clientY };
};

const addList=()=>{
  details.value.push({
    ...detail.value,
    status: "Add",

    // item: { ...this.item },
    // unit: { ...this.unit },
    // creator: { ...this.creator }
  });
};
const closeToolsPopup=()=>{
  tools_popup.value = false;
};
const replyAction=(act = "")=>{
  if (act == "insert") {
    details.value.splice(row.value, 0, {
      ...detail.value,
      status: "Add",

      // item: { ...this.item },
      // unit: { ...this.unit },
      // creator: { ...this.creator }
    });
  } else if (act == "delete") {
    let item_id = details.value[row.value].item.id;
    let el_index = exclude_lists.value.indexOf(item_id);
    if (el_index > -1)
      exclude_lists.value.splice(el_index, 1);

    if (details.value[row.value].status == "Edit")
      details.value[row.value].status = "Remove";
    else
      details.value.splice(row.value, 1);
    
  }
  tools_popup.value = false;
};

const disabled = computed(()=>{
  return transaction.value.confirmed_by || transaction.value.ref_id != null;
})
</script>