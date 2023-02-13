import { defineStore } from "pinia";
import userService from "~~/services/user.service";
export const userStore = defineStore("userStore", {
    id: 'user',
    state() {
        return {
            user: {},
            list_user: [],
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
        },
        async findAll() {
            this.list_user = await userService.findAll();
        },
        async update(data) {
            await userService.update(data);
        },
    }
});
