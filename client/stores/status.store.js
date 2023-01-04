import { defineStore } from "pinia";
import statusService from "~~/services/status.service";
export const statusStore = defineStore("statusStore", {
    id: 'status',
    state() {
        return {
            List_status: [],
        };
    },
    getters: {
        getPost(state) {
            return state.List_status.filter(e => e.name == 'private' || e.name == 'public')
        }

    },
    actions: {
        async findAll() {
            this.List_status = await statusService.findAll();
        }
    }
});
