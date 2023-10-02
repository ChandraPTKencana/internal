<script setup>
// const route = useRoute();

const nuxt = useNuxtApp();
</script>
<template>
    <div>
        event id {{ $forceUpdate.params.id }}
    </div>
</template>