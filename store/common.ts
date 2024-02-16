import { defineStore } from 'pinia';
import { markRaw } from 'vue'

export const useCommonStore = defineStore('common', {
  state: () => ({
    is_sidebar_open: false,
    loading_full: false,
    dynamic_component: null as any,
    opened_components: [] as any,
    opened_component_idx:-1
    // loading: false,
  }),
  actions: {
    triggerSidebar(act: boolean) {
      this.is_sidebar_open = act;
    },
    async setDynamicComponent(component_location:any, component_title?:string,props?:any){
      try{        
        let loadImport = await component_location();
        // const nC = await import(component_location /* @vite-ignore */);
        // this.dynamic_component =  loadImport;

        // let check_lists = this.opened_components.map((x:any)=>{return x.component_location});
        // if(check_lists.length > 0 && check_lists.indexOf(component_location) > -1) {
        //   this.opened_component_idx = check_lists.indexOf(component_location);          
        //   return;
        // }

        // if(this.opened_component.component_location == component_location)
        // return;

        this.opened_components.push({
          component_title,
          component_default : loadImport,
          component_props : props,
        });

        this.opened_component_idx = this.opened_components.length - 1;
      }catch(err){
        console.log(err) 
      }
    },
    openDynamicComponent(component_index:any){
      try{
        // if(component_index==-1){
        //   this.dynamic_component =  null;
        // }else{
        //   this.dynamic_component =  this.opened_components[component_index].component_default;
        // }        
        this.opened_component_idx = component_index;
      }catch(err){
        // console.log(err) 
      }
    },
    closeDynamicComponent(component_index:any){
      try{
        this.opened_components.splice(component_index, 1);
        
        if(this.opened_component_idx != component_index) {
          this.opened_component_idx--;
          return
        };

        if(this.opened_components.length == 0) this.opened_component_idx = -1;
        if(this.opened_components.length > 0){
          if(component_index == 0) this.opened_component_idx = 0;
          if(component_index > 0) this.opened_component_idx = component_index - 1;
        }
        this.openDynamicComponent(this.opened_component_idx);
      }catch(err){
        // console.log(err) 
      }
    }

  },
});