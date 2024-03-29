import { defineStore } from "pinia";
export const routeStore = defineStore("routeStore", {
    id: 'route',
    state() {
        return {
            redirectedFrom: null,
            cb: null,
        };
    },
    getters: {

    },
    actions: {
        async refreshData(page) {
            await this.cb(page);
        }
    },
});
