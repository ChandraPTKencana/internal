<template>
  <div class="w-full h-full flex flex-col">
    <!-- <Header :title="'List Transaction'" /> -->
    <HeaderCustom :title="'List Transaction'" :back="true" />
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex">
        <button type="button" name="button" class="border-black border-solid border-2 p-1 m-1 text-2xl "
          @click="checkAndConfirm()">
          <IconsSignature />
        </button>
      </div>

      <div class="w-full flex p-1">
        <div class="grow">
          <div class="font-bold"> Keyword </div>
          <input class="w-full border-black border-solid border-2 p-1" type="text" v-model="search" name="search"
            placeholder="Keyword">
        </div>
        <div class="flex flex-col ml-1">
          <div class="font-bold"> Filter </div>
          <select class="w-full grow border-black border-solid border-2 p-1" v-model="selected_filter_likes">
            <option v-for="filter_like in filter_likes" :value="filter_like.var">{{filter_like.val}}</option>
          </select>
        </div>
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
                <th>Source</th>
                <th>Target</th>
                <th>Note</th>
                <th>Status</th>
                <th>Requested At</th>
                <th>Requested By</th>
                <th>Ref ID</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(transaction, index) in transactions" :key="index" @click="selected = index"
                :class="selected == index ? 'active' : ''">
                <td>{{ index + 1 }}.</td>
                <td>{{ $moment(transaction.created_at).format("DD-MM-Y HH:mm:ss") }}</td>
                <td>{{ $moment(transaction.updated_at).format("DD-MM-Y HH:mm:ss") }}</td>
                <td class="bold">{{ transaction.id }}</td>
                <td>{{ transaction.warehouse_source?.name }}</td>
                <td>{{ transaction.warehouse_target?.name }}</td>
                <td>{{ transaction.note }}</td>
                <td>{{ transaction.status }}</td>
                <td>{{ $moment(transaction.requested_at).format("DD-MM-Y HH:mm:ss") }}</td>
                <td>{{ transaction.requester?.username }}</td>
                <td>{{ transaction.ref_id }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
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
  layout: "clear",
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

const filter_likes = [{
  var : "all",
  val : "All"
},{
  var : "warehouse_target_name",
  val : "Target"
},
{
  var : "warehouse_source_name",
  val : "Source"
}];

const selected_filter_likes = ref("all"); 

const params = {};
params._TimeZoneOffset = new Date().getTimezoneOffset();
const token = useCookie('token');
const { data: dt_async } = await useAsyncData(async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/api/request_transactions", {
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
    params.like = "";
    if(selected_filter_likes.value == "all"){
      params.like = filter_likes.filter((x)=>x.var!="all")
      .map((e)=>`${e.var}:%${search.value}%`).join(",");
    }else{      
      params.like = `${selected_filter_likes.value}:%${search.value}%`
    }
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
  const { data, error, status } = await useMyFetch("/api/request_transactions", {
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
const { display } = useAlertStore();

const checkAndConfirm = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    router.push({ name: 'data_transaksi-confirm', query: { id: transactions.value[selected.value].id } });
  }
};
</script>