<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List User'" />
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex">
        <button type="button" name="button" class="border-black border-solid border-2 p-1 m-1 text-2xl "
          @click="form_add()">
          <IconsPlus />
        </button>
        <button type="button" name="button" class="border-black border-solid border-2 p-1 m-1 text-2xl "
          @click="form_edit()">
          <IconsEdit />
        </button>
        <button type="button" name="button" class="border-black border-solid border-2 p-1 m-1 text-2xl "
          @click="form_permission()">
          <IconsEdit />
        </button>
        <!-- <button type="button" name="button" style="margin:4px; " @click="cetak()">
          <fa :icon="['fas','print']"/>
        </button> -->
      </div>
      <div class="w-full flex p-1">
        <div class="grow">
          <div class="font-bold"> Keyword </div>
          <input class="w-full border-black border-solid border-2 p-1" type="text" v-model="search" name="search"
            placeholder="Keyword">
        </div>
        <div class="pl-1">
          <div class="font-bold"> Sort By </div>
          <select class="w-full border-black border-solid border-2 p-1" v-model="sort.field">
            <option value=""></option>
            <option value="email">Email</option>
            <option value="fullname">Fullname</option>
          </select>
        </div>
        <div class="pl-1">
          <div class="font-bold"> Sort Order </div>
          <select class="w-full border-black border-solid border-2 p-1" v-model="sort.by">
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
        <div class="flex items-end pl-1">
          <button class="w-full border-black border-solid border-2 p-1" type="button" name="button" @click="searching()">
            <IconsSearch class="text-2xl" />
          </button>
        </div>
      </div>
      <div class="w-full flex justify-center items-center grow h-0 p-1">

        <div v-if="users.length == 0" class="">
          Maaf Tidak Ada Record
        </div>

        <div v-else class="w-full h-full overflow-auto" role="sticky" ref="loadRef" @scroll="loadMore">
          <table class="tacky">
            <thead>
              <tr class="sticky top-0 !z-[2]">
                <th>No.</th>
                <th>Email</th>
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
                <td class="bold">{{ user.email }}</td>
                <td>{{ user.fullname }}</td>
                <td>{{ user.role }}</td>
                <td>{{ $moment(user.created_at).format("DD-MM-Y HH:mm:ss") }}</td>
                <td>{{ $moment(user.updated_at).format("DD-MM-Y HH:mm:ss") }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- {{ data.greetings }} -->
      <!-- {{ users }} -->
    </div>
  </div>
</template>

<script setup>
const { $moment } = useNuxtApp()
import { storeToRefs } from 'pinia';
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';

const { sayHello } = useUtils();
sayHello();

const params = {};
params._TimeZoneOffset = new Date().getTimezoneOffset();


const token = useCookie('token');
const { data: users } = await useAsyncData(async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useFetch("/api/users", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: params,
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return [];
  }

  return data.value.data;
});


const search = ref("");
const sort = ref({
  field: "",
  by: "asc"
});
const selected = ref(-1);
const scrolling = ref({
  page: 1,
  is_last_record: false,
  scrollLeft: 0,
  may_get_data: true
});

const inject_params = () => {
  params.like = "";
  if (search.value != "") {
    params.like = `id:%${search.value}%,email:%${search.value}%,fullname:%${search.value}%`;
  }
  params.sort = "";
  if (sort.value.field) {
    params.sort = sort.value.field + ":" + sort.value.by;
  }
};

const loadRef = ref(null);

const callData = async () => {
  useCommonStore().loading_full = true;
  scrolling.value.may_get_data = false;
  params.page = scrolling.value.page;
  if (params.page == 1) users.value = [];

  const { data, error, status } = await useFetch("/api/users", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      // 'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    params: params,
    // body: {
    //   sort: "updated_at:desc"
    // },
    retry: 0,
    // server: true
  });
  useCommonStore().loading_full = false;
  scrolling.value.may_get_data = true;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  if (scrolling.value.page == 1) {
    users.value = data.value.data;
    if (loadRef.value) loadRef.value.scrollTop = 0;
  } else if (scrolling.value.page > 1) {
    users.value = [...users.value, ...data.value.data];
  }
  if (data.value.data.length == 0) {
    scrolling.value.is_last_record = true;
  }
}

const loadMore = async () => {

  if (!scrolling.value.may_get_data) return;
  let parent = loadRef.value;

  if (parent.scrollLeft != scrolling.value.scrollLeft) {
    scrolling.value.scrollLeft = parent.scrollLeft;
    return;
  }

  if (scrolling.value.is_last_record) return;

  let stuck = Math.round(parent.scrollTop) + parent.clientHeight >= parent.scrollHeight - 1 ? true : false;
  if (!stuck) return;

  scrolling.value.page++;
  await callData();

}

const searching = () => {
  scrolling.value.page = 1;
  scrolling.value.is_last_record = false;
  inject_params();
  callData();
}

const router = useRouter();

const form_add = () => {
  router.push({ name: 'user-form', query: { id: "" } });
}

const { display } = useAlertStore();
const { show, status, message } = storeToRefs(useAlertStore());

const form_edit = () => {
  if (selected.value == -1) {

    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    router.push({ name: 'user-form', query: { id: users.value[selected.value].id } });
  }
};

const form_permission = () => {
  if (selected.value == -1) {

    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    router.push({ name: 'user-permission', query: { id: users.value[selected.value].id } });
  }
};
//     // form_inject(){
//     //   if (selected==-1) {
//     //     this.$store.commit('alert/SET_ALERT',{
//     //       show:true,
//     //       status:"Gagal",
//     //       message:"Silahkan Pilih Data Terlebih Dahulu"
//     //     });
//     //   }else {
//     //     this.$router.push({name:'product-material_controls',query:{product_id:users[selected].id,status:"Inject"}})
//     //   }
//     // },
//     // form_rest(){
//     //   if (selected==-1) {
//     //     this.$store.commit('alert/SET_ALERT',{
//     //       show:true,
//     //       status:"Gagal",
//     //       message:"Silahkan Pilih Data Terlebih Dahulu"
//     //     });
//     //   }else {
//     //     this.$router.push({name:'product-material_controls',query:{product_id:users[selected].id,status:"Rest"}})
//     //   }
//     // },


//     // async cetak(){
//     //   if (selected==-1) {
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
//     //         id:users[selected].id
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
// })

</script>
<!-- <scipt>


//   computed: {
//     // ...mapState('error', ['errors']),
//     // ...mapState('_product',{
//     //    users: state => state.users,
//     //    state_product: state => state.product,
//     //    last_record: state => state.last_record,
//     //    highlight_search:state=>state.search,
//     // }),
//   },

// }
</script> -->
<style scoped="">
/* table.sticky thead th:nth-child(2) {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 2;
} */
</style>
