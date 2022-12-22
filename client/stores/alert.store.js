import { defineStore } from "pinia";
export const alertStore = defineStore("alertStore", {
    id: 'alert',
	state() {
		return {
            error: {
				message: '',
				set: 0,
			},
            success: {
				message: '',
				set: 0,
			},
			info: {
				message: '',
				set: 0,
			},
			warning: {
				message: '',
				set: 0,
			},
		};
	},
	getters: {
		
	},
	actions: {

		deleteLocalStorage(){
			localStorage.removeItem("user");
		},

		setSuccess(message, time){
			this.success.message = message
			this.success.set = time ?? 3;
			
		},
		setWarning(message, time){
			this.warning.message = message
			this.warning.set = time ?? 3;
			

		},
		setInfo(message, time){
			this.info.message = message
			this.info.set = time ?? 3;
			

		},
		setError(message,time){
			this.error.message = message
			this.error.set = time ?? 3;
			

		},
	},
});
