import { defineStore } from "pinia";
import postService from "~~/services/post.service";
import { userStore } from "./user.store";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const useUser = userStore()
export const postStore = defineStore("postStore", {
    id: 'post',
    state() {
        return {
            post_edit: {
                author: {},
                tag: new Set(),
                series: {},
                team: {},
                status: {},
                content: { },
            },
            post: {
                author: {},
                tag: new Set(),
                series: {},
                team: {},
                status: {},
                content: {},
            },
            list: [],
        };
    },
    getters: {
        
    },
    actions: {
        resetPostEdit() {
            this.post_edit = {
                author: {},
                tag: new Set(),
                series: {},
                team: {},
                status: {},
                content: {},
            }
        },
        check() {
            if (!this.post.series) {
                this.post.series = {}
            }
            if (!this.post.team) {
                this.post.team = {}
            }
            if (this.post.tag) {
                this.post.tag = new Set(this.post.tag)
            } else {
                this.post.tag = new Set()
            }
        },
        
        async create(data) {
            const id = await postService.create(data);
            return id;
        },
        async findOne(id) {
            this.post = await postService.findOne(id);
            this.check()
        },
        async findAll() {
            this.list = await postService.findAll();
        },
        async deleteOne(id) {
            await postService.deleteOne(id);  
        },
        async update(data) {
            await postService.update(data);
        }
    }
});
