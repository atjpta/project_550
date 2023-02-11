import { defineStore } from "pinia";
import seriesService from "~~/services/series.service";
export const seriesStore = defineStore("seriesStore", {
    id: 'series',
    state() {
        return {
            List_series: [],
            List_series_ByUser: [],
            series: {
                author: [],
            },
            series_edit: {
                team: {},
            }
        };
    },
    getters: {

    },
    actions: {
        reset() {
            this.List_series = []
            this.List_series_ByUser = []
            this.series = {
            }
            this.series_edit = {
                team: {},
            }
        },
        async findAll() {
            this.List_series = await seriesService.findAll();
        },

        async findByTeam(id) {
            this.List_series = await seriesService.findByTeam(id);
        },

        async findByUser(id) {
            this.List_series_ByUser = await seriesService.findByUser(id);
        },
        async create(data) {
            const id = await seriesService.create(data);
            return id;
        },

        resetSeriesEdit() {
            this.series_edit = {}
            this.series_edit.team = {};
        },

        async findOne(id) {
            this.series = await seriesService.findOne(id);
            this.series = this.series[0];
        },

        async findOneEdit(id) {
            this.series = await seriesService.findOneEdit(id);
        },

        async update(data) {
            await seriesService.update(data)
        },
        async deleteOne(id) {
            this.series = await seriesService.deleteOne(id);
        },
        
    }
});
