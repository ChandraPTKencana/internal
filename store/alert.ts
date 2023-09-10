import { defineStore } from 'pinia';

interface AlertPayloadInterface {
  show: boolean;
  status: string;
  message: string;
}

export const useAlertStore = defineStore('alert', {
  state: () => ({
    show: false,
    status: "Success | Failed",
    message: "Message"
  }),
  actions: {
    display({show,status="",message=""}:AlertPayloadInterface){
        this.show = show;
        if(this.show){
            this.status = status;
            this.message = message;
        }else{
            this.status = "";
            this.message = "";
        }
    },
},

});