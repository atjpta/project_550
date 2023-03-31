import { authStore } from "~~/stores/auth.store"
const useAuth = authStore()
export default defineNuxtRouteMiddleware((to, from) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        if (to.path == '/') {
            return navigateTo('/post/new/1')
        }
    }
})