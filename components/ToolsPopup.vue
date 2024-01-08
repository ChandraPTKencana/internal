<template>
  <div v-show="show" class="box" @click="close_it($event)">

    <div ref="popup">
      <ul>
        <li v-if="!only || only.length==0 || only.indexOf('insert')>-1" @click="$emit('replyAct','insert')">Insert</li>
        <li v-if="!only || only.length==0 || only.indexOf('delete')>-1" @click="$emit('replyAct','delete')">Delete</li>
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

ul li:first-child{
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
