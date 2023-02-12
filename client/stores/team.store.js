import { defineStore } from "pinia";
import teamService from "~~/services/team.service";
import { authStore } from "./auth.store";
export const teamStore = defineStore("teamStore", {
    id: 'team',
    state() {
        return {
            List_team: [],
            List_team_ByUser: [],
            team_edit: {
                tag: new Set(),
            },
            team: {},
        };
    },
    getters: {

    },
    actions: {

        roleTeam(list) {
            let role = ''
            if (authStore().user?.id) {
                list.forEach((e) => {
                    if (e.user == authStore().user.id) {
                        role = e.role[0].name
                        return;
                    }
                })
            }
            return role
        },

        check() {
           
            if (this.team.tag) {
                this.team.tag = new Set(this.team.tag)
            } else {
                this.team.tag = new Set()
            }
        },
        reset() {
            this.List_team = []
            this.List_team_ByUser = []
            this.team_edit = {
                tag: new Set(),
            }
            this.team = {}
        },
        async findAll() {
            this.List_team = await teamService.findAll();
            this.List_team.forEach((e, i) => {
                this.List_team[i].role = this.roleTeam(this.List_team[i].member)
            })
        },

        async findByUser(id) {
            const list = await teamService.findByUser(id);
            list.forEach(e => {
                this.List_team_ByUser.push(e.team)
            });
        },

        async create(data) {
            const id = await teamService.create(data);
            return id;
        },

        resetTeamEdit() {
            this.team_edit = {}
            this.team_edit.tag = new Set()
        },

        async findOne(id) {
            this.team = await teamService.findOne(id)
            this.team[0].role = this.roleTeam(this.team[0].member)
        },

        async update(data) {
            this.team = await teamService.update(data)
        },

        async deleteOne(id) {
            this.team = await teamService.deleteOne(id)
        },
        async findOneEdit(id) {
            this.team = await teamService.findOneEdit(id);
            this.check()
        },
    }
});
