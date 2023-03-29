import { defineStore } from "pinia";
import authService from '~~/services/auth.service'
// import { userStore } from "./user.store";
export const authStore = defineStore("authStore", {
    id: 'auth',
    state() {
        return {
            user: {
               
            },
        };
    },
    getters: {
        isUserLoggedIn(state) {
            return !!state.user && !!state.user.accessToken;
        },

        getToken(state) {
            if (state.user) {
                return state.user.accessToken
            }
            else return null
        },
        
        isAdmin(state) {
            let temp = false;
            if (state.user) {
                state.user.roles.forEach(role => {
                    if (role == 'admin') {
                        temp = true;
                        return;
                    }
                });
            }
            return temp;
        },
    },
    actions: {
        loadAuthState() {
            this.user = JSON.parse(localStorage.getItem("user"));
        },

        // setAuthState(name, avatar) {
        //     this.user.name = name
        //     this.user.avatar_Url = avatar;
        //     localStorage.setItem("user", JSON.stringify(this.user));
        // },
        logout() {
            this.user = null;
            localStorage.removeItem("user");
        },
        async signin(user) {
            const response = await authService.signin(user);
            this.user = response;
            localStorage.setItem("user", JSON.stringify(response));
            return response;
        },
        signup(user) {
            this.user = null;
            return authService.signup(user);
        },
    },
});
