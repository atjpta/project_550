import { defineStore } from "pinia";
import postService from "~~/services/post.service";
import { userStore } from "./user.store";
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import vi from 'dayjs/locale/vi'
dayjs.extend(localizedFormat);
dayjs.locale(vi);
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

        setTime(time) {
            dayjs.extend(relativeTime)
            return dayjs(time).fromNow()
        },

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
            this.post.createdAt = this.setTime(this.post.createdAt)
            this.check()
        },
        async findAll() {
            this.list = await postService.findAll();
            this.list.forEach((e, i) => {
                this.list[i].createdAt = this.setTime(this.list[i].createdAt);
            });
        },
        async deleteOne(id) {
            await postService.deleteOne(id);  
        },
        async update(data) {
            await postService.update(data);
        }
    }
});
