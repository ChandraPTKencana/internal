<script lang="ts" setup>
import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
import { useAlertStore } from '~/store/alert'

const { display } = useAlertStore();
const { show, status, message, permit_close } = storeToRefs(useAlertStore());

// if (process.client) {
//     window.addEventListener('click', (e) => {
//         const target = e.target;
//         if (target instanceof Element) {
//             // Now TypeScript knows that target is an Element
//             if (!document?.getElementById('alert')?.contains(target) && permit_close.value) {
//                 show.value = false;
//             }
//         }
//     });
// }
</script>
<template>
    <div id="alert" class="fixed w-full h-14 bottom-0 text-white p-1 border-t-2 border-slate-700 z-10" :class="status=='Failed'?'bg-red-800 ':'bg-slate-800 '"
        v-show="show">
        <div class="h-full flex flex-row flex-wrap overflow-y-auto">
            <div class="flex flex-col flex-grow">
                <ClientOnly>
                    <strong>
                        {{ status }}
                    </strong>
                    <small>
                        {{ message }}
                    </small>
                </ClientOnly>
            </div>
            <div class="flex items-center justify-center" @click="show = false">
                <IconsTimes class="text-2xl cursor-pointer" />
            </div>
        </div>
    </div>
</template>