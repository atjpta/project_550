import { defineStore } from "pinia";
import postService from "~~/services/post.service";
import { userStore } from "./user.store";
import { authStore } from "./auth.store";
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import vi from 'dayjs/locale/vi'
dayjs.extend(localizedFormat);
dayjs.locale(vi);
const useUser = userStore()
const useAuth = authStore()
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
                content: {},
            },
            post: {
                author: {},
                tag: new Set(),
                series: {},
                team: {},
                status: {},
                content: {},
                series_team: [],
            },
            list: [],
            listNoSeries: [],
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
            const user = useAuth.user ? useAuth.user.id : '';
            this.post = await postService.findOne(id, user);
            this.post = this.post[0];
            this.post.createdAt = this.setTime(this.post.createdAt)
            this.check()
        },

        async findOneEdit(id) {
            this.post = await postService.findOneEdit(id);
            this.post.createdAt = this.setTime(this.post.createdAt)
            this.check()
        },
        async findAll() {
            this.list = await postService.findAll();
            this.list.forEach((e, i) => {
                this.list[i].createdAt = this.setTime(this.list[i].createdAt);
            });
        },

        async findPerFilter(fitter, page, size) {
            const list = await postService.findPerFilter(fitter, page, size);
            list.forEach((e, i) => {
                list[i].createdAt = this.setTime(list[i].createdAt);
            });
            return list;

        },

        async findAll2() {
            this.list = await postService.findAll2();
            this.list.forEach((e, i) => {
                this.list[i].createdAt = this.setTime(this.list[i].createdAt);
            });
        },

        async findByTeam(id) {
            this.list = await postService.findByTeam(id);
            this.list.forEach((e, i) => {
                this.list[i].createdAt = this.setTime(this.list[i].createdAt);
            });
        },

        async findByAuthor(id) {
            this.list = await postService.findByAuthor(id);
            this.list.forEach((e, i) => {
                this.list[i].createdAt = this.setTime(this.list[i].createdAt);
            });
        },

        async findByOther(id) {
            this.list = await postService.findByOther(id);
            this.list.forEach((e, i) => {
                this.list[i].createdAt = this.setTime(this.list[i].createdAt);
            });
        },

        async findByTag(id) {
            this.list = await postService.findByTag(id);
            this.list.forEach((e, i) => {
                this.list[i].createdAt = this.setTime(this.list[i].createdAt);
            });
        },

        async findBySeries(id) {
            this.list = await postService.findBySeries(id);
            this.list.forEach((e, i) => {
                this.list[i].createdAt = this.setTime(this.list[i].createdAt);
            });
        },

        async findByNoSeries(id) {
            this.listNoSeries = await postService.findByNoSeries(id);
            this.listNoSeries.forEach((e, i) => {
                this.listNoSeries[i].createdAt = this.setTime(this.listNoSeries[i].createdAt);
            });
        },

        async deleteOne(id) {
            await postService.deleteOne(id);
        },
        async update(data) {
            await postService.update(data);
        },

        async updateSeries(id, data) {
            await postService.updateSeries(id, data);
        },

    }
});
