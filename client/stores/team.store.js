import { defineStore } from "pinia";
import teamService from "~~/services/team.service";
export const teamStore = defineStore("teamStore", {
    id: 'team',
    state() {
        return {
            List_team: [],
            List_team_ByUser: [],

        };
    },
    getters: {
        
    },
    actions: {
        async findAll() {
            this.List_team = await teamService.findAll();
        },

        async findByUser(id) {
            const list = await teamService.findByUser(id);
            list.forEach(e => {
                this.List_team_ByUser.push(e.team)
            });
        }
    }
});