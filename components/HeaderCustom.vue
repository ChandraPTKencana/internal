<template lang="html">
  <div class="myHeader d-flex align-items-center">
        <div v-if="back" class="text-center" style="width:40px; cursor:pointer;" @click="go_back()">
          <fa :icon="['fas','chevron-left']" style="font-size:20px; color:#fff;"/>
        </div>
        <div class="" style="padding-left:10px;">
          {{ title || " " }}
        </div>
  </div>
</template>

<script>
export default {
  props:["title","back","fn"],
  methods:{
    go_back(){
      if (this.fn) {
        this.fn();
      }else {
        this.$router.go(-1);
      }
    }
  }
}
</script>

<style lang="css" scoped>
.myHeader{
  width:100%;
  height:40px;
  display: flex;
  align-items: center;
  box-shadow:1px 1px 5px 1px #ccc;
  background: var(--primary-color);
  color:white;
}

.logo{
  padding:5px;
  width:100px;
  height:100%;
}

.tools{
  width:calc(100% - 100px);
}

ul{
  padding:5px;
  float:right;
}

ul li {
  display: inline;
  margin:5px;
}

</style>
