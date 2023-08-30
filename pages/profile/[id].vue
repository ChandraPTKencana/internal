<script setup>
// const route = useRoute();
// console.log(route.params.id)

const nuxt = useNuxtApp();
</script>
<template>
    <div>
        event id {{ $forceUpdate.params.id }}
    </div>
</template>