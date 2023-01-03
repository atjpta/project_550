import { defineStore } from "pinia";
import userService from "~~/services/user.service";
export const userStore = defineStore("userStore", {
    id: 'user',
    state() {
        return {
            user: {},
        };
    },
    getters: {

    },
    actions: {
        async findOne(id) {
            this.user = await userService.findOne(id);
        },
        clear() {
            this.user = {};
        }
    }
});
