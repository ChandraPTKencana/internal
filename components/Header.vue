
<template>
    <div class="w-full flex min-h-[3rem] items-center bg-slate-600 p-1 pl-8 sm:pl-1 text-white">
        <h1>{{ title }}</h1>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
    props: {
        title: {
            type: String, // Define the prop type
            required: true, // Specify if the prop is required
            default: 'Header Info', // Set a default value for the prop
        },
    },
});
</script>