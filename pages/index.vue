
<template>
    <div class="w-full h-full">
        <keep-alive>
            <component :is="dynamicComponent" v-bind="dynamicProps"/>
        </keep-alive>
    </div>
</template>
<script lang="ts" setup>
    import { storeToRefs } from 'pinia';
    import { useCommonStore } from '~/store/common'

    const common = useCommonStore();
    const dynamicComponent = ref(null);
    const dynamicProps = ref(null);

    watchEffect(()=>{
        let opened_id = common.opened_component_idx;
        if(opened_id > -1){
            dynamicProps.value = common.opened_components[opened_id].component_props;
            dynamicComponent.value = common.opened_components[opened_id].component_default;
        }else{
            dynamicProps.value = null;
            dynamicComponent.value = null;
        }
    })
</script>