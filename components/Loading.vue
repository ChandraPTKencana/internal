<script lang="ts" setup>
import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
import { useCommonStore } from '~/store/common'

const { loading_full } = storeToRefs(useCommonStore());

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
<template>
    <div class="fixed z-10 w-full h-full bg-slate-300 top-0 flex items-center justify-center text-4xl bg-opacity-90"
        v-show="loading_full">
        <IconsLoading />
    </div>
</template>