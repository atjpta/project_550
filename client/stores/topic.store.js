import { defineStore } from "pinia";
import topicService from "~~/services/topic.service";
export const topicStore = defineStore("topicStore", {
    id: 'topic',
    state() {
        return {
            List_topic: [],
            List_topic2: [],
            List_topic_ByUser: [],
            topic: {
            },
            topic_edit: {
                team: {},
                status: 'public'
            }
        };
    },
    getters: {

    },
    actions: {
        reset() {
            this.List_topic = []
            this.List_topic_ByUser = []
            this.topic = {
            }
            this.topic_edit = {
                team: {},
                status: 'public'

            }
        },
        async findAll() {
            this.List_topic = await topicService.findAll();
        },

        async findPerFilter(fitter, page, size) {
            const list = await topicService.findPerFilter(fitter, page, size);
            return list;

        },

        async findByTeam(id) {
            this.List_topic = await topicService.findByTeam(id);
        },

        async findByOther(id) {
            this.List_topic = await topicService.findByOther(id);
        },

        async findByAuthor(id) {
            this.List_topic = await topicService.findByAuthor(id);
        },
        async findByTag(id) {
            this.List_topic = await topicService.findByTag(id);
        },


        async findByUserTeam(id, team) {
            this.List_topic = await topicService.findByUserTeam(id, team);
        },

        async getEdit() {
            this.List_topic2 = await topicService.getEdit();
        },

        async findByUser(id) {
            this.List_topic_ByUser = await topicService.findByUser(id);
        },
        async create(data) {
            const id = await topicService.create(data);
            return id;
        },

        resettopicEdit() {
            this.topic_edit = {}
            this.topic_edit.team = {};
            this.topic_edit.status = 'public'
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
