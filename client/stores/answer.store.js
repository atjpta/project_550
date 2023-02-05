import { defineStore } from "pinia";
import answerService from "~~/services/answer.service";
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
export const answerStore = defineStore("answerStore", {
    id: 'answer',
    state() {
        return {

            cmt: {
            },
            list_answer: [],
        };
    },
    getters: {

    },
    actions: {

        setTime(time) {
            dayjs.extend(relativeTime)
            return dayjs(time).fromNow()
        },

        async create(data) {
            const id = await answerService.create(data);
        },

        async getBy(id) {
            const user = useAuth.user ? useAuth.user.id : '';
            this.list_answer = await answerService.getBy(id, user)
            this.list_answer.forEach((e, i) => {
                this.list_answer[i].createdAt = this.setTime(this.list_answer[i].createdAt);
            });
        },

        async deleteOne(id) {
            await answerService.deleteOne(id);
        },

        async update(data) {
            await answerService.update(data);
        },

    }
});
