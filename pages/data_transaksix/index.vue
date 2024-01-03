<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List Transaction'" />
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex">
        <button type="button" name="button" class="border-black border-solid border-2 p-1 m-1 text-2xl "
          @click="popup_task=true">
          <IconsPlus />
        </button>
        <button type="button" name="button" class="border-black border-solid border-2 p-1 m-1 text-sm "
          @click="openedTab = 'main'">
          Main
        </button>
        <button type="button" name="button" class="border-black border-solid border-2 p-1 m-1 text-sm "
          @click="openedTab = 'summary'">
          Summary
        </button>
        <button type="button" name="button" class="border-black border-solid border-2 p-1 m-1 text-sm "
          @click="openedTab = 'data'">
          Data
        </button>
      </div>
      <div class="w-full flex p-1 grow">
        <TransactionsMain :show="openedTab=='main'"/>
        <TransactionsSummary :show="openedTab=='summary'"/>
        <TransactionsData :show="openedTab=='data'"/>
      </div>
    </div>

    <TransactionsPopupTask :show="popup_task" :fnClose="()=>{ popup_task = false; }"/>
  </div>
</template>

<script setup>
const openedTab = ref('main'); //data

const popup_task = ref(false); //data

</script>