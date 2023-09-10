<script lang="ts" setup>
import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
import { useAlertStore } from '~/store/alert'

const { display } = useAlertStore();
const { show, status, message } = storeToRefs(useAlertStore());

if (process.client) {
    window.addEventListener('click', (e) => {
        const target = e.target;
        if (target instanceof Element) {
            // Now TypeScript knows that target is an Element
            if (document?.getElementById('alert')?.contains(target)) {
            } else {
                show.value = false;
            }
        }
    });
}
</script>
<template>
    <div id="alert" class="fixed w-full h-14 bg-slate-800 bottom-0 text-white p-1" v-show="show">
        <!-- @click="display(false)" -->
        <div class="h-full flex flex-row flex-wrap">
            <div class="flex flex-col flex-grow">
                <strong>
                    {{ status }}
                </strong>
                <small>
                    {{ message }}
                </small>
            </div>
            <div class="flex items-center justify-center">
                <IconsTimes class="text-2xl cursor-pointer" />
            </div>
        </div>
    </div>
</template>