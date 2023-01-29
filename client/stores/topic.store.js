import { defineStore } from "pinia";
import topicService from "~~/services/topic.service";
export const topicStore = defineStore("topicStore", {
    id: 'topic',
    state() {
        return {
            List_topic: [],
            List_topic_ByUser: [],
            topic: {
            },
            topic_edit: {
                team: {},
            }
        };
    },
    getters: {

    },
    actions: {
        async findAll() {
            this.List_topic = await topicService.findAll();
        },

        async getEdit() {
            this.List_topic = await topicService.getEdit();
        },

        async findByUser(id) {
            this.List_topic_ByUser = await topicService.findByUser(id);
        },
        async create(data) {
            console.log(data);
            const id = await topicService.create(data);
            return id;
        },

        resettopicEdit() {
            this.topic_edit = {}
            this.topic_edit.team = {};
        },

        async findOne(id) {
            this.topic = await topicService.findOne(id);
            this.topic = this.topic[0];
        },

        async findOneEdit(id) {
            this.topic = await topicService.findOneEdit(id);
        },

        async update(data) {
            await topicService.update(data)
        },
        async deleteOne(id) {
            this.topic = await topicService.deleteOne(id);
        },

    }
});
