import { defineStore } from "pinia";
import reviewService from "~~/services/review.service";
export const reviewStore = defineStore("reviewStore", {
    id: 'review',
    state() {
        return {
            list: [],
            review: {},
            reviewEdit: {},
            maxLength: 0,
        };
    },
    getters: {

    },
    actions: {
        async findAll() {
            this.list = await reviewService.findAll();
        },
        async findPerPage(page, size) {
            this.list = await reviewService.findPerPage(page, size);
            return this.list;
        },


        async update(data) {
            await reviewService.update(data);
        },
        async create(data) {
            await reviewService.create(data);
        },

        async findOneEdit(user, course) {
            this.reviewEdit = await reviewService.findOneEdit(user, course);
            return this.reviewEdit;
        },
        async findAvg(course) {
            this.review = await reviewService.findAvg(course);
            return this.review;
        },
        async findOneDelta(id) {
            this.review = await reviewService.findOneDelta(id);
            return this.review;
        },
        async deleteOne(id) {
            await reviewService.deleteOne(id);
        },
    }
});
