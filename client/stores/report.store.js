import { defineStore } from "pinia";
import reportService from "~~/services/report.service";
import postService from "~~/services/post.service";
import questionService from "~~/services/question.service";
import seriesService from "~~/services/series.service";
import topicService from "~~/services/topic.service";
import teamService from "~~/services/team.service";
import tagService from "~~/services/tag.service";
import userService from "~~/services/user.service";

export const reportStore = defineStore("reportStore", {
    id: 'report',
    state() {
        return {
            List_report: [],
            report: {},
            list_post: [],
            list_question: [],
            list_topic: [],
            list_series: [],
            list_team: [],
            list_user: [],
            list_tag: [],
            key: '',
        };
    },
    getters: {
        list_search_post(state) {
            let list = [];
            if (state.key.length > 0) {
                list = state.list_post.filter((e) => {
                    if (e.title) {
                        return (
                            e.title.toLowerCase().trim().indexOf(state.key.toLowerCase().trim()) > -1
                        );
                    }
                    return false;
                });
            }
            else {
                return state.list_post
            }
            return list
        },

        list_search_question(state) {
            let list = [];
            if (state.key.length > 0) {
                list = state.list_question.filter((e) => {
                    if (e.title) {
                        return (
                            e.title.toLowerCase().trim().indexOf(state.key.toLowerCase().trim()) > -1
                        );
                    }
                    return false;
                });
            }
            else {
                return state.list_question
            }
            return list
        },
        list_search_series(state) {
            let list = [];
            if (state.key.length > 0) {
                list = state.list_series.filter((e) => {
                    if (e.name) {
                        return (
                            e.name.toLowerCase().trim().indexOf(state.key.toLowerCase().trim()) > -1
                        );
                    }
                    return false;
                });
            }
            else {
                return state.list_series
            }
            return list
        },

        list_search_topic(state) {
            let list = [];
            if (state.key.length > 0) {
                list = state.list_topic.filter((e) => {
                    if (e.name) {
                        return (
                            e.name.toLowerCase().trim().indexOf(state.key.toLowerCase().trim()) > -1
                        );
                    }
                    return false;
                });
            }
            else {
                return state.list_topic
            }
            return list
        },

        list_search_user(state) {
            let list = [];
            if (state.key.length > 0) {
                list = state.list_user.filter((e) => {
                    if (e.name) {
                        return (
                            e.name.toLowerCase().trim().indexOf(state.key.toLowerCase().trim()) > -1
                        );
                    }
                    return false;
                });
            }
            else {
                return state.list_user
            }
            return list
        },

        list_search_team(state) {
            let list = [];
            if (state.key.length > 0) {
                list = state.list_team.filter((e) => {
                    if (e.name) {
                        return (
                            e.name.toLowerCase().trim().indexOf(state.key.toLowerCase().trim()) > -1
                        );
                    }
                    return false;
                });
            }
            else {
                return state.list_team
            }
            return list
            // return list;
        },

        list_search_tag(state) {
            let list = [];
            if (state.key.length > 0) {
                list = state.list_tag.filter((e) => {
                    if (e.name) {
                        return (
                            e.name.toLowerCase().trim().indexOf(state.key.toLowerCase().trim()) > -1
                        );
                    }
                    return false;
                });
            }
            else {
                return state.list_tag
            }
            return list
            // return list;
        },

    },
    actions: {
        async create(data) {
            await reportService.create(data)
        },

        async deleteByModel(id) {
            await reportService.deleteByModel(id)
        },

        async deleteOne(id) {
            await reportService.delete(id)
        },

        async getApi() {
            await this.getPost()
            await this.getQuestion()
            await this.getSeries()
            await this.getTopic()
            await this.getUser()
            await this.getTeam()
            await this.getTag()

        },
        async getPost() {
            this.list_post = await postService.findByAdmin()
        },
        async getQuestion() {
            this.list_question = await questionService.findByAdmin()
        },
        async getSeries() {
            this.list_series = await seriesService.findByAdmin()
        },
        async getTopic() {
            this.list_topic = await topicService.findByAdmin()
        },
        async getUser() {
            this.list_user = await userService.findByAdmin()
        },
        async getTeam() {
            this.list_team = await teamService.findByAdmin()
        },
        async getTag() {
            this.list_tag = await tagService.findByAdmin()
        },
    }
});
