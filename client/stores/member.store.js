import { defineStore } from "pinia";
import memberService from "~~/services/member.service";
import { authStore } from "./auth.store";
export const memberStore = defineStore("memberStore", {
    id: 'member',
    state() {
        return {
            List_member: [],
            member_edit: {},
            member: {},
            List_myteam: [],
            isMember: false,
        };
    },
    getters: {

    },
    actions: {
        setRoleVN() {
            this.List_member.forEach((e, i) => {
                if (e.role.name == 'chief' || e.role.name == 'trường nhóm') {
                    this.List_member[i].role.name = 'trường nhóm'
                }
                else if (e.role.name == 'handler') {
                    this.List_member[i].role.name = 'người điều hành'
                }
                else {
                    this.List_member[i].role.name = 'thành viên'
                }
            });
        },
        async findTeamByUser(id) {
            this.List_myteam = await memberService.findTeamByUser(id);
        },
        async findByTeam(id) {
            this.List_member = await memberService.findByTeam(id);
            this.setRoleVN()
        },

        async findByRequestTeam(id) {
            this.List_member = await memberService.findByRequestTeam(id);
        },
        async create(data) {
            const id = await memberService.create(data);
            return id;
        },
        async findOne(id) {
            this.member = await memberService.findOne(id)
        },
        async update(data) {
            this.member = await memberService.update(data)
        },
        async deleteOne(id) {
            this.member = await memberService.deleteOne(id)
        },

        async checkIsMember(team, user) {
            const member = await memberService.findIsMember(team, user)
            if (member) {
                this.isMember = true
            }
        }
    }
});
