<template lang="html">
    <div v-if="show" class="flex items-center justify-center fixed top-0 left-0 z-10 p-3 w-full h-full bg-black bg-opacity-80">
        <div class="flex items-center max-w-xs w-full relative bg-white border-solid border-gray-600 border-2 p-3 flex-col flex-wrap">
            <div class="absolute -top-7 right-0 py-1 px-2 bg-white border-solid border-2 border-gray-600 border-b-0 rounded-tl-md">
                <IconsTimes class="text-2xl text-black cursor-pointer"  @click="fnClose()"/>      
            </div>
        
            <div class="mx-0 my-2 text-justify" v-if="photo">
                <img :src="photo" alt="" class="max-w-full max-h-full">
            </div>
    
            <div class="flex w-full justify-between mt-5">
                <button @click="fnClose()" class="w-full bg-blue-500 border-blue-500 border-solid border-2 p-1 text-white mr-2"> Tutup </button>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts" setup>

const props = defineProps({
show: {
    type: Boolean,
    required: true,
},
photo: {
    type: String,
    required: false,
    default: '',
},
fnClose: {
    type: Function,
    required: true,
},
})
</script>
  