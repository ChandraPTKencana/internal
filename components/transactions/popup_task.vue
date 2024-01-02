<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Create Transaction'" :fn="fnClose" class="w-100 flex align-items-center"
      style="color:white;" />
      <div class="w-full flex grow flex-col h-0 overflow-auto bg-white">
        <div class="w-full align-items-center justify-content-center grow overflow-auto">
          <!-- <div class="w-full flex flex-col flex-wrap p-1">
            <label for="">Warehouse ID</label>
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
          </div> -->
          
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
                    <div class="text-sm text-gray-600">Email</div>
                    <div class="bold">{{ transaction.item.name }}</div>
                  </div>
                </div>
                <button class="w-10 bg-red-600 flex items-center justify-center" @click="clearItem()">
                  <IconsDelete class="text-2xl text-white" />
                </button>
              </div>
            </div>
            <p class="text-red-500">{{ field_errors.item_id }}</p>
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
  </section>

  <SearchSelectItems :show="show_item" :fnClose="closeSNSItem" :fnSelect="selectSNSItem"
    :excludes="'item_had_which_item_id'" />
</template>

<script lang="ts" setup>

const { $moment } = useNuxtApp()
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/store/auth';
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';


const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  fnClose: {
    type: Function,
    required: false,
  },
  fnSelect: {
    type: Function,
    required: false,
  },
  excludes: {
    type: String,
    required: false,
    // default: '',
  },
  exclude_lists: {
    type: Array,
    required: false,
    // default: '',
  },
})

const token = useCookie('token');
const field_errors = ref<Record<string, any>>({})

const router = useRouter();
const route = useRoute();

let empty_item = {
  id: "",
  name: "",
};

let empty_warehouse = {
  id: "",
  name: "",
};

let empty_warehouse_source = {...empty_warehouse};
let empty_warehouse_target = {...empty_warehouse};

const transaction = ref({
  id: -1,
  unit: "",
  item: {...empty_item},
  warehouse: {...empty_warehouse},
  warehouse_source: {...empty_warehouse_source},
  warehouse_target: {...empty_warehouse_target},  
  qty_in:0,
  qty_out:0,
  qty_reminder:0,
  note:"",
  status:"",
  type:"",
  requested_by:"",
  approved_by:"",
});




let show_warehouse = ref(false);
const clearWarehouse = () => {
  transaction.value.warehouse = { ...empty_warehouse };
};
const searchWarehouse = () => {
  show_warehouse.value = true;
};
const closeSNSWarehouse = () => {
  show_warehouse.value = false;
};
const selectSNSWarehouse = (warehouse: any) => {
  transaction.value.warehouse = warehouse;
  show_warehouse.value = false;
}

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


// const doSave = async () => {
//   useCommonStore().loading_full = true;
//   field_errors.value = {};


//   let data_in: Record<string, any> = {
//     "name": item.value.name,
//     "value": item.value.value,
//     "note": item.value.note,
//     "unit_id": item.value.unit.id,
//   };
//   let $method: any = "post";

//   let id = route.query.id;
//   if (id === "") {
//   } else {
//     $method = "put";
//     data_in['id'] = id;
//     // data_in.append("id", id);
//     // data_in.append("_method", "PUT");
//   }

//   const { data, error, status }: any = await useFetch("/api/item", {
//     method: $method,
//     headers: {
//       'Authorization': `Bearer ${token.value}`,
//       // 'Content-Type': 'application/json',
//       'Accept': 'application/json',
//       // "Content-Type": "multipart/form-data",
//     },
//     body: data_in,
//     retry: 0,
//     // server: true
//   });
//   useCommonStore().loading_full = false;
//   if (status.value === 'error') {
//     useErrorStore().trigger(error, field_errors);
//     return;
//   }
//   router.go(-1);
// }

</script>
<style scoped="">
table.sticky thead th:nth-child(2) {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 2;
}

table.sticky thead tr {
  top: 0;
}

.box-fixed {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0px;
  left:0px;
}

.box-fixed>div {
  width: 95%;
  height: 95%;
  background-color: white;
  border: solid 1px #ccc;
  display: flex;
  flex-direction: column;
}
</style>
