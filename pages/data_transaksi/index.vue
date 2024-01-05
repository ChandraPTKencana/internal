<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List Transaction'" />
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex">
        <button type="button" name="button" class="border-black border-solid border-2 p-1 m-1 text-2xl "
          @click="form_add()">
          <IconsPlus />
        </button>
        <button type="button" name="button" class="border-black border-solid border-2 p-1 m-1 text-2xl "
          @click="form_edit()">
          <IconsEdit />
        </button>
        <button type="button" name="button" class="border-black border-solid border-2 p-1 m-1 text-2xl "
          @click="remove()">
          <IconsDelete />
        </button>
        <button type="button" name="button" class="border-black border-solid border-2 p-1 m-1 text-2xl relative"
          @click="popup_request=true">
          <IconsCheckList /> 
          <div class="text-sm absolute top-0 right-0 flex justify-end">
            <div v-if="request_notif > 0" class=" w-2 h-2 rounded-full bg-red-700 border-2 border-solid border-red-950"></div>
          </div>
        </button>
        <!-- <button type="button" name="button" class="border-black border-solid border-2 p-1 m-1 text-2xl "
          @click="popup_summary=true">
          <IconsTable2Column />
        </button> -->
      </div>

      <div class="w-full flex p-1">
        <div class="grow">
          <div class="font-bold"> Keyword </div>
          <input class="w-full border-black border-solid border-2 p-1" type="text" v-model="search" name="search"
            placeholder="Keyword">
        </div>
        <!-- <div class="pl-1">
          <div class="font-bold"> Sort By </div>
          <select class="w-full border-black border-solid border-2 p-1" v-model="sort.field">
            <option value=""></option>
            <option value="warehouse">Warehouse</option>
            <option value="value">Value</option>
          </select>
        </div>
        <div class="pl-1">
          <div class="font-bold"> Sort Order </div>
          <select class="w-full border-black border-solid border-2 p-1" v-model="sort.by">
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div> -->
        <div class="flex items-end pl-1">
          <button class="w-full border-black border-solid border-2 p-1" type="button" name="button" @click="searching()">
            <IconsSearch class="text-2xl" />
          </button>
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
                <th>Created At</th>
                <th>Updated At</th>
                <th>ID</th>
                <th>Warehouse Name</th>
                <th>Item Name</th>
                <th>Unit Name</th>
                <th>Qty In</th>
                <th>Qty Out</th>
                <th>Qty Reminder</th>
                <th>Note</th>
                <th>Status</th>
                <th>Type</th>
                <th>Warehouse Source Name</th>
                <th>Warehouse Target Name</th>
                <th>Requested At</th>
                <th>Requested By</th>
                <th>Confirmed At</th>
                <th>Confirmed By</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(transaction, index) in transactions" :key="index" @click="selected = index"
                :class="selected == index ? 'active' : ''">
                <td>{{ index + 1 }}.</td>
                <td>{{ $moment(transaction.created_at).format("DD-MM-Y HH:mm:ss") }}</td>
                <td>{{ $moment(transaction.updated_at).format("DD-MM-Y HH:mm:ss") }}</td>
                <td class="bold">{{ transaction.id }}</td>
                <td>{{ transaction.warehouse?.name }}</td>
                <td>{{ transaction.item?.name }}</td>
                <td>{{ transaction.item?.unit?.name }}</td>
                <td>{{ pointFormat(transaction.qty_in) }}</td>
                <td>{{ pointFormat(transaction.qty_out) }}</td>
                <td>{{ transaction.qty_reminder || transaction.qty_reminder===0  ? pointFormat(transaction.qty_reminder) : ''  }}</td>
                <td>{{ transaction.note }}</td>
                <td>{{ transaction.status }}</td>
                <td>{{ transaction.type }}</td>
                <td>{{ transaction.warehouse_source?.name }}</td>
                <td>{{ transaction.warehouse_target?.name }}</td>
                <td>{{ $moment(transaction.requested_at).format("DD-MM-Y HH:mm:ss") }}</td>
                <td>{{ transaction.requester?.username }}</td>
                <td>{{ transaction.confirmed_at ? $moment(transaction.confirmed_at).format("DD-MM-Y HH:mm:ss") : '' }}</td>
                <td>{{ transaction.confirmer?.username }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <PopupMini :type="'delete'" :show="delete_box" :data="delete_data" :fnClose="toggleDeleteBox" :fnConfirm="confirmed_delete" />
    <TransactionsRequested :show="popup_request" :fnClose="()=>{ popup_request = false; }" @update_request_notif="request_notif = $event"/>
    <TransactionsSummary :show="popup_summary" :fnClose="()=>{ popup_summary = false; }"/>

  </div>
</template>

<script setup>
const { $moment } = useNuxtApp()
import { storeToRefs } from 'pinia';

import { useAuthStore } from '~/store/auth';
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';

const { pointFormat } = useUtils();

definePageMeta({
  // layout: "clear",
  middleware: [
    function (to, from) {
      // if (!useAuthStore().checkScopes(['ap-transaction-view']))
      //   return navigateTo('/');
      if (!useAuthStore().checkRole(["ClientPabrik", 'User']))
      return navigateTo('/');

    },
    // 'auth',
  ],
});

const params = {};
params._TimeZoneOffset = new Date().getTimezoneOffset();
const token = useCookie('token');
const { data: dt_async } = await useAsyncData(async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useFetch("/api/transactions", {
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
    return [];
  }
  let transactions = data.value.data;
  let request_notif = data.value.request_notif;
  return {transactions,request_notif};
});

const transactions = ref(dt_async.value.transactions);
const request_notif = ref(dt_async.value.request_notif);
const popup_request = ref(false);

const search = ref("");
const sort = ref({
  field: "updated_at",
  by: "desc"
});
const selected = ref(-1);
const scrolling = ref({
  page: 1,
  is_last_record: false,
  scrollLeft: 0,
  may_get_data: true
});

const inject_params = () => {
  params.like = "";
  if (search.value != "") {
    params.like = `id:%${search.value}%,warehouse_name:%${search.value}%,warehouse_source_name:%${search.value}%,warehouse_target_name:%${search.value}%,item_name:%${search.value}%,status:%${search.value}%,type:%${search.value}%`;
  }
  params.sort = "";
  if (sort.value.field) {
    params.sort = sort.value.field + ":" + sort.value.by;
  }
};

const loadRef = ref(null);

const callData = async () => {
  useCommonStore().loading_full = true;
  scrolling.value.may_get_data = false;
  params.page = scrolling.value.page;
  if (params.page == 1) transactions.value = [];
  if(params.page > 1){
    params.first_row = JSON.stringify(transactions.value[0]);
  }
  const { data, error, status } = await useFetch("/api/transactions", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: params,
    retry: 0,
  });
  useCommonStore().loading_full = false;
  scrolling.value.may_get_data = true;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  if (scrolling.value.page == 1) {
    transactions.value = data.value.data;
    if (loadRef.value) loadRef.value.scrollTop = 0;
  } else if (scrolling.value.page > 1) {
    transactions.value = [...transactions.value, ...data.value.data];
  }
  if (data.value.data.length == 0) {
    scrolling.value.is_last_record = true;
  }
}

const loadMore = async () => {

  if (!scrolling.value.may_get_data) return;
  let parent = loadRef.value;

  if (parent.scrollLeft != scrolling.value.scrollLeft) {
    scrolling.value.scrollLeft = parent.scrollLeft;
    return;
  }

  if (scrolling.value.is_last_record) return;

  let stuck = Math.round(parent.scrollTop) + parent.clientHeight >= parent.scrollHeight - 1 ? true : false;
  if (!stuck) return;

  scrolling.value.page++;
  await callData();

}

const searching = () => {
  scrolling.value.page = 1;
  scrolling.value.is_last_record = false;
  inject_params();
  callData();
}

const router = useRouter();

const form_add = () => {
  router.push({ name: 'data_transaksi-form', query: { id: "" } });
}

const { display } = useAlertStore();
const { show, status, message } = storeToRefs(useAlertStore());

const form_edit = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    router.push({ name: 'data_transaksi-form', query: { id: transactions.value[selected.value].id } });
  }
};


const delete_data = ref({});
const delete_box = ref(false);

const toggleDeleteBox = async()=>{  
  if (delete_box.value) {
    delete_box.value = false;
  }
};

const remove = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    delete_data.value = {id : transactions.value[selected.value].id};
    delete_box.value = true;
  }
};

const confirmed_delete = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("id", transactions.value[selected.value].id);  
  data_in.append("_method", "DELETE");

  const { data, error, status } = await useFetch("/api/transaction", {
    method: "post",
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json',
    },
    body: data_in,
    retry: 0,
  });
  useCommonStore().loading_full = false;
  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }
  transactions.value.splice(selected.value,1);
  delete_box.value = false;
}


const popup_summary = ref(false);
</script>