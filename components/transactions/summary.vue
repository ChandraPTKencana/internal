<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Summary'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

      <div class="w-full flex p-1">
        <!-- <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">From</label>
          <ClientOnly>
            <vue-date-picker class="border-black border-solid border-2" v-model="filter.from" text-input
              teleport-center></vue-date-picker>
          </ClientOnly>
          <p class="text-red-500">{{ field_errors.from }}</p>
        </div> -->
        <!-- <div class="w-full flex flex-col flex-wrap p-1">
          <label for="">To</label>
          <ClientOnly>
            <vue-date-picker class="border-black border-solid border-2" v-model="filter.to" text-input
              teleport-center></vue-date-picker>
          </ClientOnly>
          <p class="text-red-500">{{ field_errors.to }}</p>
        </div> -->
        <!-- <div class="flex items-end pl-1">
          <button class="w-full border-black border-solid border-2 p-1" type="button" name="button" @click="callData()">
            <IconsSearch class="text-2xl" />
          </button>
        </div> -->
      </div>
      <div class="w-full flex justify-center items-center grow h-0 p-1">

        <div v-if="all.length == 0" class="">
          Maaf Tidak Ada Record
        </div>

        <div v-else class="w-full h-full overflow-auto" role="sticky" ref="loadRef">
          <table class="tacky">
            <thead>
              <tr class="sticky top-0 !z-[2]">
                <th></th>
                <th v-for="ch in column_header"> {{ ch.lokasi }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in row_header" :key="index" @click="selected = index"
                :class="selected == index ? 'active' : ''">
                <td>{{ row.name }}.</td>
                <td v-for="ch in column_header">
                  <a class="text-blue-500 font-bold underline cursor-pointer" @click="open_details(returnSpesificData(ch.id,row.id))">
                    {{ returnQtyReminder(ch.id,row.id) }}
                  </a> 
                </td>

                <!-- <td>{{ index + 1 }}.</td> -->
                <!-- <td>{{ $moment(transaction.created_at).format("DD-MM-Y HH:mm:ss") }}</td>
                <td>{{ $moment(transaction.updated_at).format("DD-MM-Y HH:mm:ss") }}</td>
                <td>{{ transaction.id }}</td>
                <td>{{ transaction.warehouse_source?.name }}</td>
                <td>{{ transaction.warehouse_target?.name }}</td>
                <td>{{ transaction.item?.name }}</td>
                <td>{{ transaction.item?.unit?.name }}</td>
                <td>{{ pointFormat(transaction.qty_in) }}</td>
                <td>{{ transaction.status }}</td>
                <td>{{ $moment(transaction.requested_at).format("DD-MM-Y HH:mm:ss") }}</td>
                <td>{{ transaction.requester?.username }}</td> -->
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- <div class="flex" style="justify-content:end; padding:5px;">
        <button @click="fnClose()" class="w-36 m-1 text-black p-2 rounded-sm">
          Cancel
        </button>
        <button @click="confirm()" class="w-36 m-1 bg-blue-600 text-white p-2 rounded-sm">
          Confirm
        </button>
      </div> -->
    </div>
  </section>
  <TransactionsSummaryDetail :show="popup_details" :data="selected_data" :fnClose="()=>{popup_details = false}"/>
  <!-- <PopupMini :type="'custome'" :show="confirm_box" :data="confirm_data" :fnClose="togglePopupMiniBox" :fnConfirm="confirmOk" >
    <template #words>
      Data akan diproses dan <b>tidak dapat dikembalikan lagi</b>, yakin untuk melanjutkan ?
    </template>
  </PopupMini> -->
</template>

<script setup>

const { $moment } = useNuxtApp()
import { storeToRefs } from 'pinia';
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';

const { pointFormat } = useUtils();
const token = useCookie('token');

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
const filter = ref({
  from:"",
  to:"",
});

const all = ref([]);
const column_header = ref([]);
const row_header = ref([]);
const selected = ref(-1);

const popup_details = ref(false);
const selected_data = ref({});

const params = {};
params._TimeZoneOffset = new Date().getTimezoneOffset();

const callData = async () => {
  useCommonStore().loading_full = true;
  params.page = 1;
  // params.from = filter.value.from;
  // params.to = filter.value.to;
  all.value = [];

  const { data, error, status } = await useFetch("/api/summary_transactions", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: params,
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }
  all.value = data.value.all;
  column_header.value = data.value.column_header;
  row_header.value = data.value.row_header;
}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true)
    callData();
}, {
  immediate: true
});

const returnSpesificData =(warehouse_id,item_id)=>{
  let warehouse = all.value.filter((x)=>{return x.id == warehouse_id })[0]; 
  const { items, ...rest } = warehouse;
  let item = warehouse.items.filter((x)=>{return x.id == item_id})[0];
  return {rest,item};
}

const returnQtyReminder=(warehouse_id,item_id)=>{
  return all.value.filter((x)=>{return x.id == warehouse_id })[0].items.filter((x)=>{return x.id == item_id})[0].qty_reminder;
}

const open_details=(data,warehouse_id,item_id)=>{
  selected_data.value = data;
  popup_details.value = true;
}


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
  left: 0px;
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
