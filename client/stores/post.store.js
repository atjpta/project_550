import { defineStore } from "pinia";
import postService from "~~/services/post.service";
import { userStore } from "./user.store";
const useUser = userStore()
export const postStore = defineStore("postStore", {
    id: 'post',
    state() {
        return {
            post: {
                author: {},
                tag: new Set(),
                series: {},
                team: {},
                status: {},
                content: { },
            },
            list: [],
        };
    },
    getters: {
        
    },
    actions: {
        async create(data) {
            const id = await postService.create(data);
            return id;
        },
        async findOne(id) {
            this.post = await postService.findOne(id);
        },
        async findAll() {
            this.list = await postService.findAll();
        }
    }
});
