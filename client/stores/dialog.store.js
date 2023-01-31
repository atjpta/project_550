import { defineStore } from "pinia";
export const dialogStore = defineStore("dialogStore", {
    id: 'dialog',
    state() {
        return {
            data: {},
            dataInput: {},
            cb: null,
            cb2: null,
        };
    },
    getters: {

    },
    actions: {
        showDialog(data, cb, cb2) {
            this.data = data;
            this.cb = cb;
            this.cb2 = cb2;
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
