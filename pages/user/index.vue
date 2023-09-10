<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List User'" />
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex">
        <button type="button" name="button" class=" m-1 ">
          <!-- @click="form_add()" -->
          <IconsPlus />
        </button>
        <button type="button" name="button" class=" m-1 ">
          <!-- @click="form_edit()" -->
          <IconsEdit />
        </button>
        <!-- <button type="button" name="button" style="margin:4px; " @click="cetak()">
          <fa :icon="['fas','print']"/>
        </button> -->
      </div>
      <!-- <div class="w-full flex p-1">
        <div class="grow">
          <div class="font-bold"> Keyword </div>
          <input class="w-full" type="text" v-model="search" name="search" placeholder="Keyword">
        </div>
        <div class="pl-1">
          <div class="font-bold"> Sort By </div>
          <select v-model="sort.field">
            <option value=""></option>
            <option value="username">Username</option>
            <option value="fullname">Fullname</option>
          </select>
        </div>
        <div class="pl-1">
          <div class="font-bold"> Sort Order </div>
          <select v-model="sort.by">
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
        <div class="flex items-end pl-1">
          <button type="button" name="button" @click="searching()">
            <IconsSearch />
          </button>
        </div>
      </div> -->
      <!-- <div class="flex justify-items-center items-center grow h-0 p-1">

        <div v-if="users.length == 0" class="">
          Maaf Tidak Ada Record
        </div>

        <div v-else class="w-full h-full overflow-auto" role="sticky" ref="loadRef" @scroll="loadMore">
          <table class=" whitespace-nowrap m-0 border-none border-collapse border-spacing-0 table-fixed">
            <thead>
              <tr>
                <th>No.</th>
                <th>Username</th>
                <th>Fullname</th>
                <th>Role</th>
                <th>Tanggal Dibuat</th>
                <th>Tanggal Diubah</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in users" :key="index" @click="selected = index"
                :class="selected == index ? 'active' : ''">
                <td>{{ index + 1 }}.</td>
                <td class="bold">{{ user.username }}</td>
                <td>{{ user.fullname }}</td>
                <td>{{ user.role }}</td>
                <td>{{ $moment(user.created_at).format("DD-MM-Y HH:mm:ss") }}</td>
                <td>{{ $moment(user.updated_at).format("DD-MM-Y HH:mm:ss") }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> -->


    </div>
  </div>
</template>

<script lang="ts" setup>


// export default {
//   // layout:'defaultSide',
//   middleware: [
//     'auth-user',
//     function ({ $auth, redirect, store, route }) {
//       if ($auth.hasScope('User')) {
//         redirect(`/dashboard`);
//       }
//     }
//   ],

//   async asyncData(context) {
//     context.store.commit("SET_LOADING", true);

//     let users = [];
//     await context.app.$axios.$get(`/users`, { sort: "updated_at:desc" })
//       .then((res) => {
//         users = res.data;
//       }).catch((error) => {
//         context.store.dispatch('error/errAct', error);
//       }).then(() => {
//       })
//     context.store.commit("SET_LOADING", false);
//     return { users }
//   },
//   data() {
//     return {
//       params: {},
//       users: [],
//       search: "",
//       action: "Tambah",
//       selected: -1,
//       scrolling: {
//         page: 1,
//         is_last_record: false,
//         scrollLeft: 0,
//         may_get_data: true
//       },
//       sort: {
//         field: "",
//         by: "asc",
//       },
//     }
//   },
//   // created(){
//   //   // console.log(process.env.API_URL);
//   //   // this.start();
//   // },
//   methods: {
//     inject_params() {
//       //getTimezoneOffset
//       this.params._TimeZoneOffset = new Date().getTimezoneOffset();
//       //inject filter
//       this.params.like = "";
//       if (this.search != "") {
//         let like = `id:%${this.search}%,username:%${this.search}%,fullname:%${this.search}%`;
//         this.params.like = like;
//       }
//       this.params.sort = "";
//       if (this.sort.field) {
//         this.params.sort = this.sort.field + ":" + this.sort.by;
//       }
//     },
//     async start() {
//       this.$store.commit("SET_LOADING", true);
//       this.scrolling.may_get_data = false;

//       this.params.page = this.scrolling.page;
//       if (this.params.page == 1) this.users = [];

//       await this.$axios.$get('/users', { params: this.params })
//         .then((res) => {
//           if (this.scrolling.page == 1) {
//             this.users = res.data;
//             this.$nextTick(() => {
//               if (this.$refs.loadRef) this.$refs.loadRef.scrollTop = 0;
//             });
//             // this.$store.commit('_product/ASSIGN_DATA', res.data);
//           } else if (this.scrolling.page > 1) {
//             this.users = [...this.users, ...res.data];
//             // this.$store.commit('_product/CONCAT_DATA', res.data);
//           }
//           // this.$store.commit('_role/ASSIGN_SINGLE', res.data);
//           if (res.data.length == 0) {
//             this.scrolling.is_last_record = true;
//           }
//         }).catch((error) => {
//           this.$store.dispatch('error/errAct', error);
//         });

//       this.scrolling.may_get_data = true;
//       this.$store.commit("SET_LOADING", false);
//     },

//     async loadMore() {
//       if (!this.scrolling.may_get_data) return;
//       let parent = this.$refs.loadRef;

//       if (parent.scrollLeft != this.scrolling.scrollLeft) {
//         this.scrolling.scrollLeft = parent.scrollLeft;
//         return;
//       }

//       if (this.scrolling.is_last_record) return;

//       let stuck = Math.round(parent.scrollTop) + parent.clientHeight >= parent.scrollHeight - 1 ? true : false;
//       if (!stuck) return;

//       this.scrolling.page++;
//       await this.start();
//     },
//     searching() {
//       this.scrolling.page = 1;
//       this.scrolling.is_last_record = false;
//       this.inject_params();
//       this.start();
//     },

//     form_add() {
//       // this.$store.commit('_product/CLEAR_SINGLE');
//       this.$router.push({ name: 'user-form', query: { id: "" } });
//     },
//     form_edit() {
//       if (this.selected == -1) {
//         this.$store.commit('alert/SET_ALERT', {
//           show: true,
//           status: "Gagal",
//           message: "Silahkan Pilih Data Terlebih Dahulu"
//         });
//       } else {
//         this.$router.push({ name: 'user-form', query: { id: this.users[this.selected].id } })
//       }
//     },
//     // form_inject(){
//     //   if (this.selected==-1) {
//     //     this.$store.commit('alert/SET_ALERT',{
//     //       show:true,
//     //       status:"Gagal",
//     //       message:"Silahkan Pilih Data Terlebih Dahulu"
//     //     });
//     //   }else {
//     //     this.$router.push({name:'product-material_controls',query:{product_id:this.users[this.selected].id,status:"Inject"}})
//     //   }
//     // },
//     // form_rest(){
//     //   if (this.selected==-1) {
//     //     this.$store.commit('alert/SET_ALERT',{
//     //       show:true,
//     //       status:"Gagal",
//     //       message:"Silahkan Pilih Data Terlebih Dahulu"
//     //     });
//     //   }else {
//     //     this.$router.push({name:'product-material_controls',query:{product_id:this.users[this.selected].id,status:"Rest"}})
//     //   }
//     // },


//     // async cetak(){
//     //   if (this.selected==-1) {
//     //     this.$store.commit('alert/SET_ALERT',{
//     //       show:true,
//     //       status:"Gagal",
//     //       message:"Silahkan Pilih Data Terlebih Dahulu"
//     //     });
//     //     return;
//     //   }

//     //   try {
//     //     this.$store.commit("SET_LOADING",true);
//     //     let response = await this.$axios.$get('/product/cetak', {
//     //       params:{
//     //         id:this.users[this.selected].id
//     //       }
//     //     },{});
//     //     // downloadFile(response);
//     //     viewFile(response);
//     //   } catch (e) {
//     //   } finally {
//     //     this.$store.commit("SET_LOADING",false);
//     //   }
//     // },
//   },
//   computed: {
//     ...mapState('error', ['errors']),
//     // ...mapState('_product',{
//     //    users: state => state.users,
//     //    state_product: state => state.product,
//     //    last_record: state => state.last_record,
//     //    highlight_search:state=>state.search,
//     // }),
//   },

// }
</script>
<style scoped="">
/* table.sticky thead th:nth-child(2) {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 2;
} */
</style>
