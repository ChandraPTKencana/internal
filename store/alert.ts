import { defineStore } from 'pinia';

interface AlertPayloadInterface {
  show: boolean;
  status: string;
  message: string;
}

export const useAlertStore = defineStore('alert', {
  state: () => ({
    show: false,
    status: "",
    message: "",
    permit_close: true,
  }),
  actions: {
    display({ show, status = "", message = "" }: AlertPayloadInterface) {
      this.show = show;
      if (this.show) {
        this.status = status;
        this.message = message;
        this.permit_close = false;
        setTimeout(() => {
          this.permit_close = true;
        }, 100);
      } else {
        this.status = "";
        this.message = "";
      }
    },
  },

});