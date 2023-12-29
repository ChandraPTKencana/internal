<!-- <InputPointFormat v-model="item_transaction.qty" /> -->

<template>
  <!-- <div> -->
      <!-- <label v-show="look" @click="switchLook()" style="padding:0px 10px;"> {{value | point }} </label>
      <input v-show="!look" type="text" ref="cInput" :value="inputVal" @blur="restructure($event.target.value)"> -->

    <!-- </div> -->
    <input type="text" ref="cInput" :value="inputVal" @keyup="change($event.target.value)" @blur="blur($event.target.value),$emit('nextBlur',$event)">
    <!-- <input type="text" ref="cInput" :value="inputVal" @blur="blur($event.target.value),$emit('nextBlur',$event)"> -->
</template>

<script>
// import Footer from './Footer.vue';
// import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  props:['value'],
  data(){
    return{
      look:true,
      inputVal:0,
    }
  },
  created(){
    // this.inputVal = new Intl.NumberFormat('id-ID',{minimumFractionDigits: 2}).format(this.value);
    this.change(this.value);
    // this.inputVal = this.value.toString().replace('.',',');

  },
  methods:{
    writeIDFormat(m) {
      m = m.toString().replace(/[^,0-9]/ig, '').replace(',','.').replace(/,/ig, '');
      let splitM = m.split(".");
      splitM[0] = splitM[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      let joinM= splitM.join(",");
      return joinM;
    },

    blurIDFormat(m) {
      m = m.toString().replace(/[^,0-9]/ig, '').replace(',','.').replace(/,/ig, '');
      let splitM = m.split(".");
      splitM[0] = splitM[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      if (splitM.length > 1) {
        splitM[1] = splitM[1].replace(/0+$/,"");
      }
      let joinM= splitM.join(",");
      return joinM;
    },

    oriIDFormat(m) {
      return m.toString().replace(/[^,0-9]/ig, '').replace(',','.').replace(/,/ig, '');
    },
    // switchLook(){
    //   this.look=false;
    //   this.$nextTick(() => this.$refs.cInput.focus())
    // },
    // restructure(val){
    //   val = val.toString().replace(/[^,0-9]/ig, '').replace(',','.').replace(/,/ig, '');
    //   this.inputVal = "-";
    //   this.inputVal = val.replace('.',',');
    //   this.look = true;
    //   this.$emit('input',val);
    // },
    change(val){
      this.inputVal = this.writeIDFormat(val);
    },
    blur(val){
      this.inputVal = this.blurIDFormat(val);
      this.$emit('input',this.oriIDFormat(val));
    },
    

  },
  filters: {
    point: function (value) {
      if (!value) return 0
      return new Intl.NumberFormat('id-ID',{minimumFractionDigits: 2}).format(value);
    },
  },
  watch:{
    value:{
      handler(newV,oldV){
        this.change(newV);
    },
    deep: true
    },
    inputVal:{
      handler(newV,oldV){
        this.blur(newV);
    },
    deep: true
    },
  }
}
</script>
<style scoped>

</style>
