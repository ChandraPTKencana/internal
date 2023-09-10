<template>
  <div class="container">
    <CustomHeader :title="'Form User'" :back="'Back'"/>
    <div class="w-100 d-flex" style="flex-grow:1; flex-direction: column; height:0px; overflow:auto; background:#fff;">
      <div class="w-100 align-items-center justify-content-center" style="flex-grow:1; overflow:auto;">
          <div class="w-100 d-flex" style="flex-flow:column wrap; padding:4px;">
              <label for="">Nama Pengguna</label>
              <input type="text" v-model="user.username" v-lowercase>
              <p class="help-err">{{errors.username}}</p>
          </div>
          <div class="w-100 d-flex" style="flex-flow:column wrap; padding:4px;">
              <label for="">Nama Identitas</label>
              <input type="text" v-model="user.fullname">
              <p class="help-err">{{errors.fullname}}</p>
          </div>
          <div class="w-100 d-flex" style="flex-flow:column wrap; padding:4px;">
              <label for="">Kata Sandi</label>
              <input type="password" v-model="user.password">
              <p class="help-err">{{errors.password}}</p>
          </div>
          <div v-if="$auth.hasScope('Super_Admin')" class="w-100 d-flex" style="flex-flow:column wrap; padding:4px;">
              <label for="">Jabatan</label>
              <select v-model="user.role">
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                <option value="Super_Admin">Super Admin</option>
              </select>
              <p class="help-err">{{errors.role}}</p>
          </div>
          <!-- <div class="w-100 d-flex" style="flex-flow:column wrap; padding:4px;">
              <label for="">Status Akun</label>
              <select v-model="user.is_active">
                <option value="1">Ya</option>
                <option value="0">Tidak</option>
              </select>
              <p class="help-err">{{errors.is_active}}</p>
          </div> -->
      </div>
      <div class="w-100 d-flex align-items-center" style="justify-content:flex-end;">
          <button type="button" name="button" class="btn btn-secondary" style="width:150px; margin:4px;" @click="$router.go(-1)">
            Cancel
          </button>
          <button type="button" name="button" class="btn btn-primary" style="width:150px; margin:4px;" @click="doSave()">
            Save
          </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

import CustomHeader from '@/components/CustomHeader';

export default {
  layout: 'refresh',
  middleware:[
    'auth-user',
    function ({$auth,redirect,store,route}) {
      if ($auth.hasScope('User')) {
        redirect (`/dashboard`);
      }
    }
  ],
  components: {
    CustomHeader,
  },
  async asyncData(context){
    context.store.commit("error/CLEAR_ERRORS");

    context.store.commit("SET_LOADING",true);
    let user = {
      id:-1,
      username:"",
      fullname:"",
      password:"",
      role:"User",
      // is_active:"",
    };

    if (context.query.id!=="") {
      await context.app.$axios.$get(`/user`,{params:{id:context.query.id}})
      .then((res)=>{
        user = res.data;
        if(res.data.id==undefined){
          context.redirect (`/dashboard`);
        }
      }).catch((error)=>{
        context.store.dispatch('error/errAct',error);
      });

    }

    context.store.commit("SET_LOADING",false);
    return {
      user,
    }
  },
  data(){
    return{
      
    }
  },
  created(){
  },
  methods:{  
    async doSave(){
      this.$store.commit("SET_LOADING",true);

      this.$store.commit("error/CLEAR_ERRORS");
      // this.ASSIGN_PART({ journal:{id:this.$route.params.journal_id}});
      // let in_date = this.$moment(this.user.date).format("Y-MM-DD");

      let data_in = new FormData();
        data_in.append("username",this.user.username);
        data_in.append("password",this.user.password);
        data_in.append("fullname",this.user.fullname);
        data_in.append("role",this.user.role);
        // data_in.append("is_active",this.user.is_active);
      if (this.$route.query.id==="") {
        await this.$axios.$post('/user',data_in)
        .then((res)=>{
          this.$router.go(-1);
        }).catch((error)=>{
          this.$store.dispatch('error/errAct',error);
        });

      }else {
        data_in.append("id",this.$route.query.id);
        data_in.append("_method","PUT");

        await this.$axios.$post('/user',data_in)
        .then((res)=>{
          this.$router.go(-1);
        }).catch((error)=>{
          this.$store.dispatch('error/errAct',error);
        });

      }
      this.$store.commit("SET_LOADING",false);

    },
  },
  computed:{
    ...mapState('error',['errors']),
  },
  watch:{
    // state_user:{
    //   handler(newValue){
    //     // this.user = Object.assign({},this.user,{...newValue});
    //    // do stuff
    //  },
    //  deep: true
    // }
  }


}
</script>
<style scoped="">

</style>
