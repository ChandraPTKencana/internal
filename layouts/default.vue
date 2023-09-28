<template>
  <div class="w-full h-full flex">

    <nav :class="is_sidebar_open ? 'left-0' : 'right-full'"
      class="bg-slate-800 h-full w-48 fixed sm:relative sm:right-0 text-white z-10">
      <div class="relative h-full">
        <button class="absolute left-full h-12 text-2xl text-white bg-slate-500 sm:hidden"
          @click="triggerSidebar(!is_sidebar_open)">
          <IconsTimes v-if="is_sidebar_open" />
          <IconsBurger v-else />
        </button>
        <header class="h-full flex flex-col p-2 overflow-hidden">
          <ul class="grow overflow-auto">
            <li><nuxt-link to="/">Dashboard</nuxt-link></li>
            <li><nuxt-link to="/events">Events</nuxt-link></li>
            <li><nuxt-link to="/user">User</nuxt-link></li>
            <li><nuxt-link to="/institute">Institute</nuxt-link></li>
            <li><nuxt-link to="/member">Member</nuxt-link></li>
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
              <button class="w-full text-left p-2 hover:bg-slate-900">
                Setting
              </button>
              <nuxt-link v-if="authenticated" class="block w-full text-left p-2 hover:bg-slate-900" @click="logout">
                Logout
              </nuxt-link>
            </div>
            <div class="bg-slate-700 bg-opacity-80 p-2 cursor-pointer" @click="is_panel_open = !is_panel_open">
              {{ email }}
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
import { useCommonStore } from '~/store/common';

const router = useRouter();

const { logUserOut } = useAuthStore();
const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive
const { triggerSidebar } = useCommonStore(); // make authenticated state reactive
const { is_sidebar_open } = storeToRefs(useCommonStore()); // make authenticated state reactive

const logout = () => {
  logUserOut();
  router.push('/login');
};

const email = useCookie('email');

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