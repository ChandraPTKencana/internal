<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Summary Detail'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

      <div class="w-full flex p-1 flex-wrap flex-row">
        <div class="w-full sm:w-1/3 md:w-1/3 lg:w-1/4 p-1">
          <div class="font-bold"> Warehouse Name </div>
          <div class="w-full p-1">
            {{ props.data?.rest?.lokasi }}
          </div>
        </div>
        <div class="w-full sm:w-1/3 md:w-1/3 lg:w-1/4 p-1">
          <div class="font-bold"> Item Name </div>
          <div class="w-full p-1">
            {{ props.data?.item?.name }}
          </div>
        </div>

        <div class="w-full sm:w-1/3 md:w-1/3 lg:w-1/4 p-1">
          <div class="font-bold"> Last Stock </div>
          <div class="w-full p-1">
            {{ props.data?.item?.qty_reminder }} {{ props.data?.item?.unit_name }}
          </div>
        </div>



      </div>
      <div class="w-full flex justify-center items-center grow h-0 p-1">

        <div v-if="transactions.length == 0" class="">
          Maaf Tidak Ada Record
        </div>

        <div v-else class="w-full h-full overflow-auto" role="sticky" ref="loadRef" @scroll="loadMore">
          <table class="tacky">
            <thead>
              <tr class="sticky top-0 !z-[2]">
                <th>No.</th>
                <th>Input At</th>
                <th>Type</th>
                <th>Qty In</th>
                <th>Qty Out</th>
                <th>Qty Reminder</th>
                <th>Note</th>
                <th>Confirm At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(transaction, index) in transactions" :key="index" @click="selected = index"
                :class="selected == index ? 'active' : ''">
                <td>{{ index + 1 }}.</td>
                <td>{{ $moment(transaction.input_at).format("DD-MM-Y") }}</td>
                <td>
                  {{ transaction.type }}
                  <br>
                  {{ transaction.type =='transfer' ? "To : "+transaction.lokasi : "" }}
                </td>
                <td>{{ transaction.qty_in ? pointFormat(transaction.qty_in) +  ` ${props.data?.item?.unit_name}` : "" }}</td>
                <td>{{ transaction.qty_out ? pointFormat(transaction.qty_out) + ` ${props.data?.item?.unit_name}` : "" }}</td>
                <td>{{ transaction.qty_reminder ? pointFormat(transaction.qty_reminder) +  ` ${props.data?.item?.unit_name}` : ''  }}</td>
                <td>{{ transaction.note }}</td>
                <td>{{ transaction.confirmed_at ? $moment(transaction.confirmed_at).format("DD-MM-Y HH:mm:ss") : '' }}</td>
                <td>{{ $moment(transaction.updated_at).format("DD-MM-Y HH:mm:ss") }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- <div class="flex" style="justify-content:end; padding:5px;">
        <button @click="fnClose()" class="w-36 m-1 text-black p-2 rounded-sm">
          Cancel
        </button>
        <button @click="confirm()" class="w-36 m-1 bg-blue-600 text-white rounded-sm">
          Confirm
        </button>
      </div> -->
    </div>
  </section>
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
  warehouse_id: {
    type: Number,
    required: false,
  },
  item_id: {
    type: Number,
    required: false,
  },
  data:{
    type:Object,
    required:true
  }
})
const filter = ref({
  from:"",
  to:"",
});

const transactions = ref([]);
const selected = ref(-1);

const params = {};
params._TimeZoneOffset = new Date().getTimezoneOffset();

const callData = async () => {
  useCommonStore().loading_full = true;
  params.page = 1;
  params.item_id = props.data.item.id;
  params.warehouse_id = props.data.rest.id;
  // params.from = filter.value.from;
  // params.to = filter.value.to;
  transactions.value = [];

  const { data, error, status } = await useMyFetch("/api/summary_detail_transactions", {
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
  transactions.value = data.value.data;
}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true)
    callData();
}, {
  immediate: true
});

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
