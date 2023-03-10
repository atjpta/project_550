import { defineStore } from "pinia";
import followService from "~~/services/follow.service";
import { authStore } from "./auth.store";
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import vi from 'dayjs/locale/vi'
export const followStore = defineStore("followStore", {
    id: 'follow',
    state() {
        return {
            follow: {},
            follow_user: [],
            follow_post: [],
            follow_question: [],
            follow_topic: [],
            follow_series: [],
            follow_team: [],
            follow_tag: [],
        };
    },
    getters: {

    },

    

    actions: {
        setTime(time) {
            dayjs.extend(relativeTime)
            return dayjs(time).fromNow()
        },
        async findByFollow(user, follow) {
            this.follow = await followService.findByFollow(user, follow);
        },
        async findByMyUser(id) {
            this.follow_user = await followService.findByMy('myuser',id);
        },
        async findByMyPost(id) {
            this.follow_post = await followService.findByMy('mypost', id);
            this.follow_post.forEach((e, i) => {
                this.follow_post[i].createdAt = this.setTime(e.post[0].createdAt)
            });
        },
        async findByMyQuestion(id) {
            this.follow_question = await followService.findByMy('myquestion',id);
            this.follow_question.forEach((e, i) => {
                this.follow_question[i].createdAt = this.setTime(e.question[0].createdAt)
            });
        },
        async findByMySeries(id) {
            this.follow_series = await followService.findByMy('myseries',id);
        },
        async findByMyTopic(id) {
            this.follow_topic = await followService.findByMy('mytopic',id);
        },
        async findByMyTeam(id) {
            this.follow_team = await followService.findByMy('myteam',id);
        },

        async findByMyTag(id) {
            this.follow_tag = await followService.findByMy('mytag', id);
        },

        async create(data) {
            const id = await followService.create(data);
            return id;
        },
        async deleteOne(id) {
            await followService.deleteOne(id)
        },

        async update(id) {
            await followService.update(id)
        }

    }
});
