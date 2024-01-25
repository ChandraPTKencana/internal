<template>
  <div v-show="show" class="box" @click="close_it($event)">

    <div ref="popup">
      <ul>
        <li v-if="!only || only.length==0 || only.indexOf('insert')>-1" @click="$emit('replyAct','insert')">Insert</li>
        <li v-if="!only || only.length==0 || only.indexOf('delete')>-1" @click="$emit('replyAct','delete')">Delete</li>
        <li v-if="
          (!only || only.length==0 || only.indexOf('moveTop')>-1) 
          && data_index != 0 && data.length > 0" 
          @click="moveTop()">Move Top</li>
        <li v-if="
          (!only || only.length==0 || only.indexOf('moveBottom')>-1)
          && data_index != data.length - 1 && data.length > 0" 
          @click="moveBottom()">Move Bottom</li>
      </ul>
    </div>

  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  coor: {
    type: Object,
    required: false,
    // default: '',
  },
  fn: {
    type: Function,
    required: true,
  },
  only: {
    type: Object,
    // required: true,
  },
  data_index: {
    type: Number,
    // required: true,
  },
  data:{
    type:Array
  }

})

const popup = ref<HTMLInputElement | null>(null);
// const popup = ref(null);


const close_it=(e:any)=>{
  if (e.target.classList.contains('box')) {
    props.fn();
  }
}

watch(()=>props.coor, (newVal, oldVal) => {
  if (newVal && popup.value) {
    // this.searching();
    popup.value.style.left = newVal.left + 'px';
    popup.value.style.top = newVal.top + 'px';
  }
}, {
  immediate: true,
  deep:true
});

// watch(()=>props.show, (newVal, oldVal) => {
// }, {
//   immediate: true,
//   deep:true
// });
const moveTop=()=>{
  let old = props.data[props.data_index];
  props.data.splice(props.data_index,1);
  props.data.splice(props.data_index - 1,0,{...old});
  props.fn();
};

const moveBottom=()=>{
  let old = props.data[props.data_index];
  props.data.splice(props.data_index,1);
  props.data.splice(props.data_index + 1,0,{...old})
  props.fn();
}



</script>
<style scoped>
.box{
  z-index:5;
  position:fixed;
  left:0px;
  top:0px;
  width:100vw;
  height:100vh;
}


.box > div{
  width:100px;
  /* height:50px; */
  position:absolute;
  left:0px;
  top:0px;
  background:white;
  border:solid 1px #ccc;
}

ul{
  padding:0;
  list-style-type: none;
}

ul li:not(:last-child){
  border-bottom:solid 1px #ccc;
}

ul li{
  padding:5px;
}

ul li:hover{
  cursor: pointer;
  background: rgba(0, 0, 0, 0.05);
}
</style>
