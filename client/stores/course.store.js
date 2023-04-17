import { defineStore } from "pinia";
import courseService from "~~/services/course.service";
export const courseStore = defineStore("courseStore", {
    id: 'course',
    state() {
        return {
            list: [],
            course: {},
            maxLength: 0,
        };
    },
    getters: {

    },
    actions: {
        async findAll() {
            this.list = await courseService.findAll();
        },
        async findPerPage(page, size) {
            this.list = await courseService.findPerPage(page, size);
            return this.list;
        },

        async findPerPageType(type, page, size) {
            const list = await courseService.findPerPageType(type, page, size);
            this.list = list
            return list
        },
        async update(data) {
            await courseService.update(data);
        },
        async create(data) {
            await courseService.create(data);
        },

        async findOne(id) {
            this.course = await courseService.findOne(id);
            return this.course;
        },
        async findOneDelta(id) {
            this.course = await courseService.findOneDelta(id);
            return this.course;
        },
        async deleteOne(id) {
            await courseService.deleteOne(id);
        },
        async getMaxLength() {
            this.maxLength = await courseService.maxLength();
        },

        async getMaxLengthType(type) {
            let length = await courseService.maxLengthType(type);
            return length
        },


    }
});
