<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List Member'" />
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
      </div>

      <div class="w-full flex p-1">
        <div class="grow">
          <div class="font-bold"> Keyword </div>
          <input class="w-full border-black border-solid border-2 p-1" type="text" v-model="search" name="search"
            placeholder="Keyword">
        </div>
        <div class="pl-1">
          <div class="font-bold"> Sort By </div>
          <select class="w-full border-black border-solid border-2 p-1" v-model="sort.field">
            <option value=""></option>
            <option value="username">Username</option>
            <option value="email">Email</option>
            <option value="fullname">Fullname</option>
            <!-- <option value="role">Role</option> -->
          </select>
        </div>
        <div class="pl-1">
          <div class="font-bold"> Sort Order </div>
          <select class="w-full border-black border-solid border-2 p-1" v-model="sort.by">
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
        <div class="flex items-end pl-1">
          <button class="w-full border-black border-solid border-2 p-1" type="button" name="button" @click="searching()">
            <IconsSearch class="text-2xl" />
          </button>
        </div>
      </div>
      <div class="w-full flex justify-center items-center grow h-0 p-1">

        <div v-if="members.length == 0" class="">
          Maaf Tidak Ada Record
        </div>

        <div v-else class="w-full h-full overflow-auto" role="sticky" ref="loadRef" @scroll="loadMore">
          <table class="tacky">
            <thead>
              <tr>
                <th>No.</th>
                <th>Username</th>
                <th>Email</th>
                <th>Fullname</th>
                <!-- <th>Photo</th> -->
                <th>Can Login</th>
                <th>Created At</th>
                <th>Creator</th>
                <th>Updated At</th>
                <th>Updator</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(member, index) in members" :key="index" @click="selected = index"
                :class="selected == index ? 'active' : ''">
                <td>{{ index + 1 }}.</td>
                <td class="bold">{{ member.username }}</td>
                <td>{{ member.email }}</td>
                <td>{{ member.fullname }}</td>
                <!-- <td>
                  <img :src="member.photo" />
                </td> -->
                <td>{{ member.can_login ? 'Ya' : 'Tidak' }}</td>
                <td>{{ $moment(member.internal_created_at).format("DD-MM-Y HH:mm:ss") }}</td>
                <td>{{ member.internal_creator.email }}</td>
                <td>{{ $moment(member.internal_updated_at).format("DD-MM-Y HH:mm:ss") }}</td>
                <td>{{ member.internal_updator.email }}</td>
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

definePageMeta({
  // layout: "clear",
  middleware: [
    function (to, from) {
      if (!useAuthStore().checkScopes(['ap-member-view']))
        return navigateTo('/');
    },
    // 'auth',
  ],
});

const date = ref();

const token = useCookie('token');
const { data: members } = await useAsyncData(async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useFetch("/api/internal/members", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    retry: 0,
  });
  useCommonStore().loading_full = false;
  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return [];
  }
  return data.value.data;
});


const search = ref("");
const sort = ref({
  field: "",
  by: "asc"
});
const selected = ref(-1);
const params = ref({});
const scrolling = ref({
  page: 1,
  is_last_record: false,
  scrollLeft: 0,
  may_get_data: true
});

const inject_params = () => {
  params.value._TimeZoneOffset = new Date().getTimezoneOffset();
  params.value.like = "";
  if (search.value != "") {
    params.value.like = `id:%${search.value}%,username:%${search.value}%,email:%${search.value}%,fullname:%${search.value}%,role:%${search.value}%`;
  }
  params.value.sort = "";
  if (sort.value.field) {
    params.value.sort = sort.value.field + ":" + sort.value.by;
  }
};

const loadRef = ref(null);

const callData = async () => {
  useCommonStore().loading_full = true;
  scrolling.value.may_get_data = false;
  params.value.page = scrolling.value.page;
  if (params.value.page == 1) members.value = [];

  const { data, error, status } = await useFetch("/api/internal/members", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    retry: 0,
  });
  useCommonStore().loading_full = false;
  scrolling.value.may_get_data = true;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  if (scrolling.value.page == 1) {
    members.value = data.value.data;
    if (loadRef.value) loadRef.value.scrollTop = 0;
  } else if (scrolling.value.page > 1) {
    members.value = [...members.value, ...data.value.data];
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
  router.push({ name: 'member-form', query: { id: "" } });
}

const { display } = useAlertStore();
const { show, status, message } = storeToRefs(useAlertStore());

const form_edit = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    router.push({ name: 'member-form', query: { id: members.value[selected.value].id } });
  }
};

// const form_permission = () => {
//   if (selected.value == -1) {
//     display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
//   } else {
//     router.push({ name: 'member-permission', query: { id: members.value[selected.value].id } });
//   }
// };
</script>