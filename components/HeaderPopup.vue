<template lang="html">
  <div class="w-full flex min-h-[3rem] items-center bg-slate-600 p-1 sm:pl-1 text-white">
    <div class="grow" style="padding-left:10px;">
      {{ title || " " }}
    </div>
    <div class="text-center w-10 cursor-pointer" @click="go_back()">
      <IconsTimes class="text-2xl text-white" />
    </div>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  title: {
    type: String,
    required: false,
    default: '',
  },
  // show: {
  //   type: Boolean,
  //   required: true,
  // },
  fn: {
    type: Function,
    required: false,
  },
})

const router = useRouter();
const go_back = () => {
  if (props.fn) props.fn();
  else router.go(-1);
}
</script>
