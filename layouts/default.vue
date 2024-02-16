<template>
  <div class="w-full h-full flex">

    <nav :class="is_sidebar_open ? 'left-0' : 'right-full'"
      class="bg-slate-800 h-full min-w-[150px] max-w-[150px] fixed sm:relative sm:right-0 text-white z-10"
      style="width:320px;">
      <div class="relative h-full">
        <button v-if="is_sidebar_open"  class="absolute left-full h-12 text-2xl text-white bg-slate-800 sm:hidden ring-0 focus:ring-0 rounded-none rounded-br rounded-tr mt-1"
          @click="triggerSidebar(!is_sidebar_open)">
          <IconsTimes />
          <!-- <IconsBurger v-else /> -->
        </button>
        <header class="h-full flex flex-col p-2 overflow-hidden">
          <ul class="grow overflow-auto">
            <li :class="activeMenu == '/'?'active':''" >
              <nuxt-link to="/" class="cursor-pointer" @click="goTo('/')">
                <IconsHome class="mr-1"/>
                Tabs
              </nuxt-link>
            </li>
            <li v-if="checkRole(['Super Admin','ClientPabrik','KTU', 'User'])" class="pl-6">
              <nuxt-link class="cursor-pointer" @click="openCom(dt_satuan_index,'Satuan')">
                <IconsScale class="mr-1"/>
                Satuan
              </nuxt-link>
            </li>
            <li v-if="checkRole(['Super Admin','ClientPabrik','KTU', 'User'])" class="pl-6">
              <nuxt-link class="cursor-pointer" @click="openCom(dt_item_index,'Item')">
                <IconsProduct class="mr-1"/>
                Item
              </nuxt-link>
            </li>
            <li v-if="checkRole(['Super Admin','ClientPabrik','KTU', 'User'])" class="pl-6">
              <nuxt-link class="cursor-pointer" @click="openCom(dt_transaksi_index,'Transaksi')">
                <IconsCreditCard class="mr-1"/>
                Transaksi
              </nuxt-link>
            </li>

            <!-- <li>
              <nuxt-link class="cursor-pointer" @click="openCom(dt_test_index,'TEST',{show:'10'})">
                TEST
              </nuxt-link>
            </li> -->

            <!-- <li v-if="checkRole(['Super Admin','ClientPabrik','KTU', 'User'])" :class="activeMenu == '/tools_note'?'active':''" >
              <nuxt-link to="/tools_note" class="cursor-pointer" @click="goTo('/tools_note')">
                <IconsCreditCard class="mr-1"/>
                Note
              </nuxt-link>
            </li> -->
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
      <TabBar />
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

// import dt_transaksi_index from '~/tabs/data_transaksi/index'
// import dt_satuan_index from '~/tabs/data_satuan/index'
// import dt_item_index from '~/tabs/data_item/index'

const dt_transaksi_index = () => markRaw(defineAsyncComponent(() => import('~/tabs/data_transaksi/index.vue')));
const dt_satuan_index = () => markRaw(defineAsyncComponent(() => import('~/tabs/data_satuan/index.vue')));
const dt_item_index = () => markRaw(defineAsyncComponent(() => import('~/tabs/data_item/index.vue')));


const router = useRouter();
const route = useRoute();

const activeMenu = ref('');
watch(() => route.path, (newVal, oldVal) => {
  let splitPath = newVal.split("/");
  activeMenu.value = "/"+(splitPath.length > 1 ? splitPath[1] : '');
}, {
  immediate: true
});


const { logUserOut } = useAuthStore();
const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive
const { triggerSidebar } = useCommonStore(); // make authenticated state reactive
const { is_sidebar_open } = storeToRefs(useCommonStore()); // make authenticated state reactive
const token = useCookie('token');

const logout = async() => {
  useCommonStore().loading_full = true;
  const { data, error, status }: any = await useMyFetch("/api/logout", {
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
    useCommonStore().opened_component_idx = -1;
    useCommonStore().opened_components = [];
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
const role = useCookie('role'); // useCookie new hook in nuxt 3
const checkRole=(list:Array<string>)=>{
  return (list).includes(role.value as string);
};

const openCom=async(location:any,title:string)=>{
  await useCommonStore().setDynamicComponent(location,title);
  // if(activeMenu.value == url) return;
  // activeMenu.value = url;
  is_sidebar_open.value=false;
}

const goTo=async(url)=>{
  if(activeMenu.value == url) return;
  activeMenu.value = url;
  is_sidebar_open.value=false;
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
    display: flex;
    width:100%;
    align-items: center;
  }
</style>