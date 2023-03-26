import { defineStore } from "pinia";
import { authStore } from "./auth.store";
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import vi from 'dayjs/locale/vi'
import notificationService from "~~/services/notification.service";
export const notificationStore = defineStore("notificationStore", {
    id: 'notification',
    state() {
        return {
            list_notification : [],
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
             await notificationService.create(data)
        },

        async createOne(data) {
            await notificationService.createOne(data)
        },
        async findByMy(id) {
            this.list_notification = await notificationService.findByMy(id)
            this.list_notification.forEach((e, i) => {
                this.list_notification[i].createdAt = this.setTime(e.createdAt);
            });
        },
        async deleteOne(id) {
            await notificationService.deleteOne(id)
        },
        async deleteByMy(id) {
            await notificationService.deleteByMy(id)
        },
        async update(data) {
            await notificationService.update(data)
        },

        async updateMarkAllByUser(id) {
            await notificationService.updateMarkAllByUser(id)
        },
    }
});
