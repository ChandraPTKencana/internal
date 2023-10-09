<template>
  <div class="w-full h-full flex flex-col">
    <HeaderCustom :title="'Form Permission'" :back="true" />
    <div v-if="user_id != ''" class="w-full flex grow flex-col overflow-auto bg-white">
      <div class="w-full items-center justify-center grow overflow-auto">
        <div class="flex p-1" v-for="action_permission in action_permission_view">
          <div class=" w-96 ">{{ action_permission.group }}</div>
          <div class="grow">
            <div class="flex flex-wrap flex-row" v-for="list in action_permission.list">
              <div>
                <input type="checkbox" :id="list.name + list.action" v-model="list.check" />
                <label :for="list.name + list.action">{{
                  list.description
                }}</label>
              </div>
            </div>
          </div>
        </div>

        <hr />

        <div class="flex p-1" v-for="data_permission in data_permission_view">
          <div class="w-96">{{ data_permission.group }}</div>
          <div class="grow">
            <div class="flex flex-row flex-wrap" v-for="list in data_permission.list">
              <div>
                <input type="checkbox" :id="list.table_name + list.field_name + list.status" v-model="list.check" />
                <label :for="list.table_name + list.field_name + list.status">{{
                  list.description
                }}</label>
              </div>
            </div>
          </div>
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
</template>

<script lang="ts" setup>
import { useAuthStore } from '~/store/auth';

import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';
import { toDisplayString } from 'nuxt/dist/app/compat/capi';

definePageMeta({
  layout: "clear",
  middleware: [
    function (to, from) {
      if (!useAuthStore().checkScopes(["ap-user_permission-view", 'ap-user_permission-edit']))
        return navigateTo('/');
    },
    // 'auth',
  ],
});

const route = useRoute();

let user_id: string = '';

if (typeof route.query.id === 'string') {
  user_id = route.query.id;
}

if (typeof route.query.id === "undefined" || user_id == '') {
  useAlertStore().display({
    show: true,
    status: "Failed",
    message: "Url had something missing, contact IT support"
  });
}



const token = useCookie('token');

useCommonStore().loading_full = true;

const { data: data_lists, error, status }: any = await useAsyncData(async () => {
  let action_permissions: any = [];
  let data_permissions: any = [];

  const [data1, data2, data3] = await Promise.all([
    useFetch("/api/action_permissions", {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json'
      },
      retry: 0,
    }),
    useFetch("/api/data_permissions", {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json'
      },
      retry: 0,
    }),
    useFetch("/api/user/permissions", {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json'
      },
      params: { id: user_id },
      retry: 0,
    })
  ]);

  if (data1.status.value !== 'error') {
    action_permissions = data1.data.value;
  }
  if (data2.status.value !== 'error') {
    data_permissions = data2.data.value;
  }
  if (data3.status.value !== 'error') {

    let user: any = data3.data.value;
    let action_permission_ids: any = user.data.action_permissions.map((x: any) => x.id);
    let data_permission_ids: any = user.data.data_permissions.map((x: any) => x.id);

    action_permissions.data.map((curr: any) => {
      if (action_permission_ids.indexOf(curr.id) > -1) {
        curr.check = true;
      } else {
        curr.check = false;
      }
      return curr;
    });

    data_permissions.data.map((curr: any) => {
      if (data_permission_ids.indexOf(curr.id) > -1) {
        curr.check = true;
      } else {
        curr.check = false;
      }
      return curr;
    });
  }

  return { action_permissions, data_permissions }
});
useCommonStore().loading_full = false;


const action_permissions = data_lists.value.action_permissions ?? [];
const data_permissions = data_lists.value.data_permissions ?? [];


const doSave = async () => {
  useCommonStore().loading_full = true;

  let data_in = new FormData();
  data_in.append(
    "action_permissions",
    JSON.stringify(action_permissions.data.filter((x: any) => x.check))
  );
  data_in.append(
    "data_permissions",
    JSON.stringify(data_permissions.data.filter((x: any) => x.check))
  );

  data_in.append("id", user_id);
  data_in.append("_method", "PUT");

  const { data, error, status }: any = await useFetch("/api/user/permissions", {
    method: 'post',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      // 'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: data_in,
    // params: { id },
    // body: {
    //   sort: "updated_at:desc"
    // },
    retry: 0,
    // server: true
  });

  if (status.value === 'error') {
    useErrorStore().trigger(error);
  } else {
    useAlertStore().display({
      show: true,
      status: "Success",
      message: data.value.message
    })
  }

  useCommonStore().loading_full = false;


}

let action_permission_view = computed(() => {
  let result: any = [];
  if (action_permissions.data && action_permissions.data.length > 0) {

    action_permissions.data.forEach((curr: any) => {
      let index = result.map((x: any) => x.group).indexOf(curr.name);
      if (index == -1) {
        result.push({
          group: curr.name,
          list: [curr]
        });
      } else {
        result[index].list.push(curr);
      }
    });
  }

  return result;
});

let data_permission_view = computed(() => {
  let result: any = [];


  if (data_permissions.data && data_permissions.data.length > 0) {
    data_permissions.data.forEach((curr: any) => {
      let index = result.map((x: any) => x.group).indexOf(curr.table_name);
      if (index == -1) {
        result.push({
          group: curr.table_name,
          list: [curr]
        });
      } else {
        result[index].list.push(curr);
      }
    });
  }

  return result;
});
</script>
<style scoped=""></style>
