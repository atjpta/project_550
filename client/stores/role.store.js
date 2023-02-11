import { defineStore } from "pinia";
import roleService from "~~/services/role.service";
export const roleStore = defineStore("roleStore", {
    id: 'role',
    state() {
        return {
            List_role: [],
            List_role_team: [],
        };
    },
    getters: {
        getIdMember(state) {
            let id;
            state.List_role.forEach((e) => {
                if (e.name == 'member') {
                    id = e.id
                    return
                }
            })
            return id;
        },
    },
    actions: {
        setRoleTeamVN() {
            this.List_role_team = [];
            this.List_role.forEach((e, i) => {
                if (e.name == 'handler') {
                    this.List_role_team.push({
                        _id: e.id,
                        name: 'người điều hành'
                    })
                }
                else if (e.name == 'member') {
                    this.List_role_team.push({
                        _id: e.id,
                        name: 'thành viên'
                    })
                }
            });
        },
        async findAll() {
            this.List_role = await roleService.findAll();
            this.setRoleTeamVN()
        },
    }
});
