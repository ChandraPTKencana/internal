import { defineStore } from 'pinia';


export const useSetupStore = defineStore('setup', {
  state: () => ({
    is_sidebar_open: false,
    // loading: false,
  }),
  actions: {
    triggerSidebar(act: boolean) {
      this.is_sidebar_open = act;
    },
  },
});