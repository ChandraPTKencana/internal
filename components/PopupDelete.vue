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
        Data yang akan dihapus <b>tidak dapat dikembalikan lagi</b>, yakin untuk menghapus data ini ?
      </div>

      <div v-for="(v, k) in delete_data">
        {{ k }} : {{ v }}
      </div>

      <div class="flex w-full justify-between">
        <button @click="fnClose()" class="w-full bg-blue-500 border-blue-500 border-solid border-2 p-1 text-white mr-2"> Batal </button>
        <button @click="fnConfirm()" class="w-full bg-red-600 border-red-600 border-solid border-2 p-1 text-white"> Lanjutkan </button>
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
  delete_data: {
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
})

// const router = useRouter();
// const go_back = () => {
//   if (props.fn) props.fn();
//   else router.go(-1);
// }
</script>
