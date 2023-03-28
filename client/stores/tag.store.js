import { defineStore } from "pinia";
import tagService from "~~/services/tag.service";
import { authStore } from "./auth.store";
export const tagStore = defineStore("tagStore", {
    id: 'tag',
    state() {
        return {
            List_tag: [],
            tag: {},
        };
    },
    getters: {

    },
    actions: {
        async findAll() {
            this.List_tag = await tagService.findAll();
        },

        async findAllInfo() {
            this.List_tag = await tagService.findAllInfo();
        },

        async findAllInfoPage(page, size) {
            this.List_tag = await tagService.findAllInfoPage(page, size);
        },


        async findByAuthor(id) {
            this.List_tag = await tagService.findByAuthor(id);
        },

        async findOne(id) {
            this.tag = await tagService.findOne(id);
        },
        async update(data) {
            await tagService.update(data);
        },
        async deleteOne(id) {
            await tagService.deleteOne(id);
        },
        async createAll(data) {
            const array = Array.from(data);
            const newtag = []
            array.forEach(e => {
                const id = e.id ?? e._id
                if (!id) {
                    newtag.push({
                        name: e.name,
                        author: authStore().user.id
                    })
                }
            })
            if (newtag.length > 0) {
                const list = await tagService.createAll(newtag);
                return list;
            }
        }
    }
});
