<template lang="html">
  <div v-if="show" class="flex items-center justify-center fixed top-0 left-0 z-10 p-3 w-full h-full bg-black bg-opacity-80">
    <div class="flex items-center max-w-xs w-full relative bg-white border-solid border-gray-600 border-2 p-3 flex-col flex-wrap">
      <div class="absolute -top-7 right-0 py-1 px-2 bg-white border-solid border-2 border-gray-600 border-b-0 rounded-tl-md">
        <IconsTimes class="text-2xl text-black cursor-pointer"  @click="fnClose()"/>      
      </div>
      <div class="flex items-center justify-center p-2 border-red-600 border-solid border-2 rounded-full">
        <IconsExclamation class="text-4xl text-red-600"/>      
      </div>

      <div class=" mx-0 my-2 text-justify">
        <div v-if="type=='custome'">
          <slot name="words"></slot>  
        </div>
        <div v-else-if="type=='delete'">
          Data yang akan dihapus <b>tidak dapat dikembalikan lagi</b>, yakin untuk menghapus data ini ?        
        </div>
      </div>

      <div class="w-full text-left mt-3" >
        <b class="text-gray-600" >Data Information :</b>
        <table class="w-full border-solid border-2 border-black ">
          <tr v-for="(v, k) in data">
            <td class="border-solid border-2 border-black p-1 capitalize bg-slate-800 text-white text-right">{{ k }}</td>
            <td class="border-solid border-2 border-black p-1 text-left">{{ v }}</td>
          </tr>
        </table>
      </div>

      <div class="w-full text-left mt-3">
        <slot name="footer"></slot> 
      </div>

      <div class="flex w-full justify-between mt-5">
        <button @click="fnClose()" class="w-full bg-blue-500 border-blue-500 border-solid border-2 p-1 text-white mr-2"> Batal </button>

        <button @click="fnConfirm()" :disabled="!props.enabledOk || countDown > 0" 
        class="w-full  border-solid border-2 p-1 text-white"
        :class="props.enabledOk && countDown <= 0 ? 'bg-red-600 border-red-600' : 'bg-slate-600 border-slate-600'"
        >
         Lanjutkan {{ countDown > 0 ? countDown : '' }}
        </button>
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
  data: {
    type: Object,
    required: false,
    default: '',
  },
  fnClose: {
    type: Function,
    required: true,
  },
  fnConfirm: {
    type: Function,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  enabledOk: {
    type: Boolean,
    required: false,
    default: true,
  },

})
let interval: null | ReturnType<typeof setInterval>  = null;
const countDown = ref(0);
const startCounting = ()=>{
  if(interval==null){
    countDown.value=1;
    interval = setInterval(()=>{
      countDown.value--;
      if(countDown.value<=0){
        clearInterval(interval);
        interval = null;
      }
    },1000);
  }
};


watch(()=>props.show,(newVal, oldVal) => {

  if(newVal)
  startCounting();
  else
  {
    clearInterval(interval);
    interval = null;
  }
}, {
  immediate: true,
  deep:true
});


watch(()=>props.enabledOk,(newVal, oldVal) => {
  if(newVal && props.show)
  startCounting();
}, {
  immediate: true,
  deep:true
});

onUnmounted(()=>{
  clearInterval(interval);
  interval = null;
});


// const router = useRouter();
// const go_back = () => {
//   if (props.fn) props.fn();
//   else router.go(-1);
// }
</script>
