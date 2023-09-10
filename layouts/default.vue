<template>
  <div class="w-full h-full flex">

    <nav :class="is_sidebar_open ? 'left-0' : 'right-full'"
      class="bg-slate-800 h-full w-48 fixed sm:relative sm:right-0 text-white">
      <div class="relative h-full">
        <button class="absolute left-full h-12 text-2xl text-white bg-slate-500"
          @click="triggerSidebar(!is_sidebar_open)">
          <IconsTimes v-if="is_sidebar_open" />
          <IconsBurger v-else />
        </button>
        <header class="h-full flex flex-col">
          <ul class="grow overflow-auto">
            <li><nuxt-link to="/">Dashboard</nuxt-link></li>
            <li><nuxt-link to="/events">Events</nuxt-link></li>
            <li v-if="!authenticated" class="loginBtn" style="float: right">
              <nuxt-link to="/login">Login</nuxt-link>
            </li>
            <li v-if="authenticated" class="loginBtn" style="float: right">
              <nuxt-link @click="logout">Logout</nuxt-link>
            </li>
          </ul>
          <div class="h-7">
            {{ email }}
          </div>
        </header>
      </div>
    </nav>

    <div class="grow flex flex-col">
      <slot />
    </div>
  </div>
  <Alert />
  <Loading />
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/store/auth';
import { useSetupStore } from '~/store/setup';

const router = useRouter();

const { logUserOut } = useAuthStore();
const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive
const { triggerSidebar } = useSetupStore(); // make authenticated state reactive
const { is_sidebar_open } = storeToRefs(useSetupStore()); // make authenticated state reactive

const logout = () => {
  logUserOut();
  router.push('/login');
};

const email = useCookie('email');
</script>