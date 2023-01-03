import { defineStore } from "pinia";
import seriesService from "~~/services/series.service";
export const seriesStore = defineStore("seriesStore", {
    id: 'series',
    state() {
        return {
            List_series: [],
            List_series_ByUser: [],
        };
    },
    getters: {

    },
    actions: {
        async findAll() {
            this.List_series = await seriesService.findAll();
        },

        async findByUser(id) {
            this.List_series_ByUser = await seriesService.findByUser(id);
        }
        
    }
});
