import { defineStore } from "pinia";
import cmtService from "~~/services/cmt.service";
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
export const cmtStore = defineStore("cmtStore", {
    id: 'cmt',
    state() {
        return {
            
            cmt: {
            },
            list_cmt: [],
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
            const id = await cmtService.create(data);
        },

        async getBy(type, id) {
            this.list_cmt = await cmtService.getBy(type, id, useAuth.user.id)
            this.list_cmt.forEach((e, i) => {
                this.list_cmt[i].createdAt = this.setTime(this.list_cmt[i].createdAt);
            });
        }
       
    }
});
