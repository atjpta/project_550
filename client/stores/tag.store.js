import { defineStore } from "pinia";
import tagService from "~~/services/tag.service";
export const tagStore = defineStore("tagStore", {
    id: 'tag',
    state() {
        return {
            List_tag: [],
        };
    },
    getters: {

    },
    actions: {
        async findAll() {
            this.List_tag = await tagService.findAll();
        }
    }
});
