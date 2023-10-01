<template>
  <div>
    <!-- <NuxtWelcome /> -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script lang="ts" setup>
// import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
// import { useAlertStore } from '~/store/alert'

// const { display } = useAlertStore();
// const { show, status, message } = storeToRefs(useAlertStore());

// if (process.client) {
//     window.addEventListener('click', (e) => {
//         const target = e.target;
//         if (target instanceof Element) {
//             // Now TypeScript knows that target is an Element
//             if (document?.getElementById('alert')?.contains(target)) {
//             } else {
//                 show.value = false;
//             }
//         }
//     });
// }
</script>
