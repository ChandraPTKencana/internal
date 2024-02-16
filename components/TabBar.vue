<template>
    <div class="w-full min-h-[2rem] flex overflow-hidden">
        <button class="min-w-8 w-8 h-8 m-1 p-0 text-2xl text-black bg-slate-300 sm:hidden flex justify-center items-center"
            @click="triggerSidebar(!is_sidebar_open)">
            <IconsBurger />
        </button>
        <div class="grow w-0 h-full flex overflow-hidden relative" ref="tab_bar">
            <div class="max-h-full h-full flex absolute top-0 left-0 gap-1 items-end">
                <button v-for="(oc,index) in opened_components" type="button" name="button" class=" flex whitespace-nowrap items-center justify-center ring-0 rounded-bl-none rounded-br-none p-0" :data-tab_bar="index" 
                :class="opened_component_idx==index ? 'bg-slate-600 text-white h-full' : 'bg-slate-400 text-black text-xs h-4/5'">
                    <div class="w-full h-full p-1 grid place-content-center" @click="openDynamicComponent(index)">
                        {{oc.component_title}}
                    </div>
                    <div class="p-1">
                        <IconsTimes  @click="closeDynamicComponent(index)"/>                    
                    </div>
                </button>
            </div>
        </div>
    </div>

</template>
<script lang="ts" setup>
    import { storeToRefs } from 'pinia';
    import { useCommonStore } from '~/store/common';

    const { triggerSidebar,openDynamicComponent,closeDynamicComponent } = useCommonStore(); // make authenticated state reactive
    const { is_sidebar_open,opened_components,opened_component_idx } = storeToRefs(useCommonStore()); // make authenticated state reactive

    const tab_bar = ref<HTMLElement | null>(null);
    const tab_bar_child = ref<HTMLElement | null>(null);
    const coorX = ref({
        start:0,
        end:0,
    })

    const touchStart= (e: TouchEvent) => {
        coorX.value.start = e.changedTouches[0].clientX;
        e.currentTarget.addEventListener("touchmove",touchMove);
        e.currentTarget.addEventListener("touchend",touchEnd);
        e.currentTarget.addEventListener("touchleave",touchEnd);
    }

    const touchEnd=(e:TouchEvent)=>{
        coorX.value.end = e.changedTouches[0].clientX;
        calcAndMove();
        e.currentTarget.removeEventListener("touchmove",touchMove);
        e.currentTarget.removeEventListener("touchend",touchEnd);
        e.currentTarget.removeEventListener("touchleave",touchEnd);
    }

    const touchMove= (e: TouchEvent) => {
        coorX.value.end = e.changedTouches[0].clientX;
        calcAndMove();
        coorX.value.start = e.changedTouches[0].clientX;

        if(e.changedTouches[0].clientY > tab_bar.value.clientHeight)
        {
            e.currentTarget.removeEventListener("touchmove",touchMove);
            e.currentTarget.removeEventListener("touchend",touchEnd);
            e.currentTarget.removeEventListener("touchleave",touchEnd);
        }
        

        // console.log(e.changedTouches[0].clientY)
    }

   

    const mouseDown = (e)=>{
        coorX.value.start = e.x;
        e.currentTarget.addEventListener("mousemove",mouseMove);
        e.currentTarget.addEventListener("mouseup",mouseUp);
        e.currentTarget.addEventListener("mouseleave",mouseUp);
    }

    const mouseUp = (e)=>{
        coorX.value.end = e.x;
        calcAndMove();
        e.currentTarget.removeEventListener("mousemove",mouseMove);
        e.currentTarget.removeEventListener("mouseup",mouseUp);
        e.currentTarget.removeEventListener("mouseleave",mouseUp);
    }

    const mouseMove = (e)=>{
        coorX.value.end = e.x;
        calcAndMove();
        coorX.value.start = e.x;
    }

    const calcAndMove = ()=>{
        if(tab_bar.value.clientWidth > tab_bar_child.value.clientWidth) return;
        let limitRight = tab_bar.value.clientWidth - tab_bar_child.value.clientWidth;
        let diff = coorX.value.end - coorX.value.start;
        if(diff==0) return;

        let oldLeft = parseFloat(tab_bar_child.value.style.left) || 0;

        let result = "";
        if(oldLeft + diff > 0)
        result = "0px";
        
        if(oldLeft + diff < limitRight) 
        result = limitRight + "px";

        if(result=="") result = (oldLeft + diff)+'px';        
        tab_bar_child.value.style.left =  result;
    }

    const handleResize = ()=>{
        calcAndMove();
    }

    onMounted(()=>{
        tab_bar_child.value = tab_bar.value.firstChild;

        tab_bar.value.addEventListener('mousedown',mouseDown,{passive: true});
        tab_bar.value.addEventListener('mouseup',mouseUp,{passive: true});
        // tab_bar.value.addEventListener('mouseleave',mouseUp,{passive: true});

        tab_bar.value.addEventListener('touchstart',touchStart,{passive: true});
        // tab_bar.value.addEventListener('touchmove',touchMove,{passive: true});
        tab_bar.value.addEventListener('touchend',touchEnd,{passive: true});
    
        window.addEventListener('resize', handleResize);
    })

</script>