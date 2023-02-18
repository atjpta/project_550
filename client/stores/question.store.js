import { defineStore } from "pinia";
import questionService from "~~/services/question.service";
import { userStore } from "./user.store";
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import vi from 'dayjs/locale/vi'
import { authStore } from "./auth.store";
dayjs.extend(localizedFormat);
dayjs.locale(vi);
const useUser = userStore()
const useAuth = authStore()
export const questionStore = defineStore("questionStore", {
    id: 'question',
    state() {
        return {
            question_edit: {
                tag: new Set(),
            },
            question: {
                tag: new Set(),
                author: {},
                status: {},
                content: {},
            },
            list: [],
            listNoTopic: [],
        };
    },
    getters: {

    },
    actions: {

        setTime(time) {
            dayjs.extend(relativeTime)
            return dayjs(time).fromNow()
        },

        resetQuestionEdit() {
            this.question_edit = {
            }
            this.question_edit.tag = new Set()
            this.question_edit.topic = {};
        },

        check() {
            if (this.question.tag) {
                this.question.tag = new Set(this.question.tag)
            } else {
                this.question.tag = new Set()
            }
        },

        async create(data) {
            const id = await questionService.create(data);
            return id;
        },
        async findOne(id) {
            const user = useAuth.user ? useAuth.user.id : '';
            this.question = await questionService.findOne(id, user);
            this.question = this.question[0];
            this.question.createdAt = this.setTime(this.question.createdAt)
            this.check()
        },

        async findOneEdit(id) {
            this.question = await questionService.findOneEdit(id);

            this.question.createdAt = this.setTime(this.question.createdAt)
            this.check()
        },
        async findAll() {
            this.list = await questionService.findAll();
            this.list.forEach((e, i) => {
                this.list[i].createdAt = this.setTime(this.list[i].createdAt);
            });
        },

        async findByTeam(id) {
            this.list = await questionService.findByTeam(id);
            this.list.forEach((e, i) => {
                this.list[i].createdAt = this.setTime(this.list[i].createdAt);
            });
        },

        async findByTag(id) {
            this.list = await questionService.findByTag(id);
            this.list.forEach((e, i) => {
                this.list[i].createdAt = this.setTime(this.list[i].createdAt);
            });
        },

        async findByAuthor(id) {
            this.list = await questionService.findByAuthor(id);
            this.list.forEach((e, i) => {
                this.list[i].createdAt = this.setTime(this.list[i].createdAt);
            });
        },

        async findByTopic(id) {
            this.list = await questionService.findByTopic(id);
            this.list.forEach((e, i) => {
                this.list[i].createdAt = this.setTime(this.list[i].createdAt);
            });
        },

        async findByNoTopic(id) {
            this.listNoTopic = await questionService.findByNoTopic(id);
            this.listNoTopic.forEach((e, i) => {
                this.listNoTopic[i].createdAt = this.setTime(this.listNoTopic[i].createdAt);
            });
        },

        async deleteOne(id) {
            await questionService.deleteOne(id);
        },
        async update(data) {
            await questionService.update(data);
        },

        async updateTopic(id, data) {
            await questionService.updateTopic(id, data);
        },

    }
});
