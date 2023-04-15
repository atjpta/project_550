import { defineStore } from "pinia";
import typecourseService from "~~/services/typecourse.service";
export const typecourseStore = defineStore("typecourseStore", {
    id: 'typecourse',
    state() {
        return {
            list: [],
            typecourse: {},
            maxLength: 0,
        };
    },
    getters: {

    },
    actions: {
        async findAll() {
            this.list = await typecourseService.findAll();
        },
        async findPerPage(page, size) {
            this.list = await typecourseService.findPerPage(page, size);
        },
        async update(data) {
            await typecourseService.update(data);
        },
        async create(data) {
            await typecourseService.create(data);
        },
        async deleteOne(id) {
            await typecourseService.deleteOne(id);
        },
        async maxLength(id) {
            this.maxLength = await typecourseService.deleteOne(id);
        },


    }
});
