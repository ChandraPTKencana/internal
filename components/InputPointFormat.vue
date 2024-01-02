<template>
    <input type="text" :value="inputVal" 
      @keyup="change($event)"
      @blur="blur($event),$emit('nextBlur',$event)"
    >
</template>

<script lang="ts" setup>

const props = defineProps({
  value: {
    type: Number,
    required: true,
    default: 0,
  },
  // show: {
  //   type: Boolean,
  //   required: true,
  // },
  // fn: {
  //   type: Function,
  //   required: false,
  // },
})

const look = ref(true);
const inputVal = ref(0);
const emit = defineEmits(['input','nextBlur']);
const writeIDFormat=(m:any)=>{
  m = m.toString().replace(/[^,0-9]/ig, '').replace(',','.').replace(/,/ig, '');
  let splitM = m.split(".");
  splitM[0] = splitM[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  let joinM= splitM.join(",");
  return joinM;
};

const blurIDFormat=(m:any)=>{
  m = m.toString().replace(/[^,0-9]/ig, '').replace(',','.').replace(/,/ig, '');
  let splitM = m.split(".");
  splitM[0] = splitM[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  if (splitM.length > 1) {
    splitM[1] = splitM[1].replace(/0+$/,"");
  }
  let joinM= splitM.join(",");
  return joinM;
};

const oriIDFormat=(m:any)=>{
  return m.toString().replace(/[^,0-9]/ig, '').replace(',','.').replace(/,/ig, '');
};

const change=(val:any)=>{
  if(val.target) val.preventDefault();
  let result = (typeof val == 'object' ? val.target.value : val).toString();  
  if(result && result.match(/[a-z]+/ig)){
    inputVal.value = 0;
  }
  else
  inputVal.value = writeIDFormat(result);
}
const blur=(val:any)=>{
  let result = typeof val == 'object' ? val.target.value : val;
  if(result){    
    inputVal.value = blurIDFormat(result);
    emit('input',Number(oriIDFormat(result))); 
  }
}

onMounted(() => {
  change(props.value)
});

const point = computed((value) =>{
  if (!value) return 0
  return new Intl.NumberFormat('id-ID',{minimumFractionDigits: 2}).format(value);
});

// watch(inputVal, (newVal, oldVal) => {
//   blur(newVal);
// }, {
//   immediate: true,
//   deep:true
// });

watch(() => props.value, (newVal, oldVal) => {
  change(newVal);
}, {
  immediate: true,
  deep:true
});
</script>
<style scoped>

</style>
