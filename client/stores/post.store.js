import { defineStore } from "pinia";
export const postStore = defineStore("postStore", {
    id: 'post',
    state() {
        return {
            post: null,
        };
    },
    getters: {
        
    },
    actions: {
    }
});
