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
                topic: {},
            },
            question: {
                tag: new Set(),
                author: {},
                topic: {},
                team: {},
                status: {},
                content: {},
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

        resetQuestionEdit() {
            this.question_edit = {
            }
            this.question_edit.tag = new Set()
            this.question_edit.topic = {};
        },

        check() {
            if (!this.question.series) {
                this.question.series = {}
            }
            if (!this.question.team) {
                this.question.team = {}
            }
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

        async findBySeries(id) {
            this.list = await questionService.findBySeries(id);
            this.list.forEach((e, i) => {
                this.list[i].createdAt = this.setTime(this.list[i].createdAt);
            });
        },

        async findByNoSeries(id) {
            this.listNoSeries = await questionService.findByNoSeries(id);
            this.listNoSeries.forEach((e, i) => {
                this.listNoSeries[i].createdAt = this.setTime(this.listNoSeries[i].createdAt);
            });
        },

        async deleteOne(id) {
            await questionService.deleteOne(id);
        },
        async update(data) {
            await questionService.update(data);
        },

        async updateSeries(id, data) {
            await questionService.updateSeries(id, data);
        },

    }
});
