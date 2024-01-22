<template lang="html">
  <div v-if="show" class="flex items-center justify-center fixed top-0 left-0 z-10 p-3 w-full h-full bg-black bg-opacity-80">
    <div class="flex items-center max-w-xs w-full h-5/6 relative bg-white border-solid border-gray-600 border-2 p-3 flex-col">
      <div class="absolute -top-7 right-0 py-1 px-2 bg-white border-solid border-2 border-gray-600 border-b-0 rounded-tl-md">
        <IconsTimes class="text-2xl text-black cursor-pointer"  @click="fnClose()"/>      
      </div>
      
      <div class="w-full grow text-left mt-3 flex-col overflow-hidden" >
        <b class="text-gray-600" >Selected List:</b>
        <div class="w-full h-full grow overflow-auto p-2">

          <div v-for="(v, k) in data" class="w-full flex flex-row flex-wrap  items-center bg-blue-500 my-1 text-white rounded justify-between">
            <div class="flex flex-row flex-wrap  items-center">
              <div v-for="mk in multi_key" class="p-1">            
                {{ v[mk] }}
              </div>
            </div>
            <IconsTimes class="text-2xl cursor-pointer"  @click="fnRemoveFromList(k)"/>      
          </div>
          
        </div>
      </div>

      <!-- <div class="w-full text-left mt-3">
        <slot name="footer"></slot> 
      </div> -->

      <div class="flex w-full justify-between mt-5">
        <button @click="fnClose()" class="w-full bg-blue-500 border-blue-500 border-solid border-2 p-1 text-white mr-2"> Tutup </button>

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
  fnRemoveFromList:{
    type:Function,
    required:true
  },  
  enabledOk: {
    type: Boolean,
    required: false,
    default: true,
  },
  multi_key: {
    type: Array,
    required: true
    // default: '',
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
