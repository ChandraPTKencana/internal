<template>
    <slot />
    <Alert />
    <Loading />
</template>
<script lang="ts" setup>
// import { storeToRefs } from 'pinia';
// import { useAuthStore } from '~/store/auth';

// const router = useRouter();

// const { logUserOut } = useAuthStore();
// const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive

// const logout = () => {
//   logUserOut();
//   router.push('/login');
// };
</script>