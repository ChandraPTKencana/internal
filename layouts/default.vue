<template>
  <div class="w-full h-full flex">

    <nav :class="is_sidebar_open ? 'left-0' : 'right-full'"
      class="bg-slate-800 h-full min-w-[150px] max-w-[150px] fixed sm:relative sm:right-0 text-white z-10"
      style="width:320px;">
      <div class="relative h-full">
        <button class="absolute left-full h-12 text-2xl text-white bg-slate-500 sm:hidden"
          @click="triggerSidebar(!is_sidebar_open)">
          <IconsTimes v-if="is_sidebar_open" />
          <IconsBurger v-else />
        </button>
        <header class="h-full flex flex-col p-2 overflow-hidden">
          <ul class="grow overflow-auto">
            <li :class="activeMenu == '/'?'active':''" >
              <nuxt-link to="/" @click="activeMenu = '/'">Dashboard</nuxt-link></li>
            <li :class="activeMenu == '/data_satuan'?'active':''" >
              <nuxt-link to="/data_satuan" @click="activeMenu = '/data_satuan'">Satuan</nuxt-link></li>
            <li :class="activeMenu == '/data_gudang'?'active':''" >
              <nuxt-link to="/data_gudang" @click="activeMenu = '/data_gudang'">Gudang</nuxt-link></li>
            <li :class="activeMenu == '/data_item'?'active':''" >
              <nuxt-link to="/data_item" @click="activeMenu = '/data_item'">Item</nuxt-link></li>
            <!-- <li><nuxt-link to="/events">Events</nuxt-link></li>
            <li><nuxt-link to="/user">User</nuxt-link></li>
            <li><nuxt-link to="/institute">Institute</nuxt-link></li>
            <li><nuxt-link to="/member">Member</nuxt-link></li> -->
            <!-- <li v-if="!authenticated" class="loginBtn" style="float: right">
              <nuxt-link to="/login">Login</nuxt-link>
            </li> -->
            <!-- <li v-if="authenticated" class="loginBtn" style="float: right">
              <nuxt-link @click="logout">Logout</nuxt-link>
            </li> -->
          </ul>
          <div id="panel" class="h-7 text-xs relative">
            <div v-show="is_panel_open"
              class="w-full absolute bottom-full mb-2 bg-slate-700 bg-opacity-80 cursor-pointer">
              <nuxt-link to="/profile" class="block w-full text-left p-2 hover:bg-slate-900">
                Setting
              </nuxt-link>
              <nuxt-link v-if="authenticated" class="block w-full text-left p-2 hover:bg-slate-900" @click="logout">
                Logout
              </nuxt-link>
            </div>
            <div class="bg-slate-700 bg-opacity-80 p-2 cursor-pointer" @click="is_panel_open = !is_panel_open">
              {{ fullname }}
            </div>
          </div>
        </header>
      </div>
    </nav>

    <div class="grow flex flex-col overflow-hidden">
      <slot />
    </div>
  </div>
  <Alert />
  <Loading />
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/store/auth';

import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';

const router = useRouter();
const route = useRoute();

const activeMenu = ref(route.path);

const { logUserOut } = useAuthStore();
const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive
const { triggerSidebar } = useCommonStore(); // make authenticated state reactive
const { is_sidebar_open } = storeToRefs(useCommonStore()); // make authenticated state reactive
const token = useCookie('token');

const logout = async() => {
  useCommonStore().loading_full = true;
  const { data, error, status }: any = await useFetch("/api/logout", {
    method: "post",
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json',
    },    
    retry: 0,
  });
  useCommonStore().loading_full = false;
  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }else{
    logUserOut();
    router.push('/login');
  }

};

const username = useCookie('username');
const fullname = useCookie('fullname');
const is_panel_open = ref(false);

if (process.client) {
  window.addEventListener('click', (e) => {
    const target = e.target;
    if (target instanceof Element) {
      // Now TypeScript knows that target is an Element
      if (document?.getElementById('panel')?.contains(target)) {
      } else {
        is_panel_open.value = false;
      }
    }
  });
}


</script>
<style>
  ul li{
    padding:5px;
  }

  ul li.active{
    background-color: #2e5289;
  }

  ul li a{
    display: block;
  }
</style>