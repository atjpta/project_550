import { defineStore } from "pinia";
export const dialogStore = defineStore("dialogStore", {
    id: 'dialog',
    state() {
        return {
            data: {},
            dataInput: {},
            cb: null,
        };
    },
    getters: {

    },
    actions: {
        showDialog(data, cb) {
            this.data = data;
            this.cb = cb;
        },
        showDialogInput(data, cb) {
            this.dataInput = data;
            this.cb = cb;
        },
        hiddenDialog() {
            this.data = {};
            this.dataInput = {},
            this.cb = null;
        },
    },
});
