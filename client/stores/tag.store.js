import { defineStore } from "pinia";
import tagService from "~~/services/tag.service";
import { authStore } from "./auth.store";
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
        },
        async createAll(data) {
            const array = Array.from(data);
            const newtag = []
            array.forEach(e => {
                if (!e.id) {
                    newtag.push({
                        name: e.name,
                        author: authStore().user.id
                    })
                }
            })
            if (newtag.length > 0) {
                await tagService.createAll(newtag);
            }
        }
    }
});
