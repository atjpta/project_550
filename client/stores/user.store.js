import { defineStore } from "pinia";
import userService from "~~/services/user.service";
export const userStore = defineStore("userStore", {
    id: 'user',
    state() {
        return {
            user: {},
            list_user: [],
            overview: {},
            maxlength: 0,
        };
    },
    getters: {
        isAdmin(state) {
            let temp = false;
            if (state.user?.role?.name == 'admin') {
                temp = true;
            }
            return temp;
        },

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
        async findAllOverView() {
            this.list_user = await userService.findAllOverView();
        },

        async findAllOverViewPage(page, size) {
            this.list_user = await userService.findAllOverViewPage(page, size);
        },
        async getMaxLength() {
            this.maxlength = await userService.maxLength();
        },
        async update(data) {
            await userService.update(data);
        },
        async findOverView(id) {
            const overview = await userService.findOverView(id);
            this.overview = overview[0]
        },
    }
});
