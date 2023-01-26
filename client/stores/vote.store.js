import { defineStore } from "pinia";
import voteService from "~~/services/vote.service";
export const voteStore = defineStore("voteStore", {
    id: 'vote',
    state() {
        return {
            vote: {},
            list_vote: [],
        };
    },
    getters: {

    },
    actions: {
        async create(data) {
            return await voteService.create(data);
        },
        async findOne(id) {
            this.vote = await voteService.findOne(id);
        },
        async update(data, id) {
            await voteService.update(data, id);
        }
    }
});
