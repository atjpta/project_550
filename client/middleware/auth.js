import { authStore } from "~~/stores/auth.store"
import { routeStore } from "~~/stores/route.store"

const useRoute = routeStore()
const useAuth = authStore()
export default defineNuxtRouteMiddleware((to, from) => {
    if (!useAuth.isUserLoggedIn) {
        useRoute.redirectedFrom = from.fullPath;
        return navigateTo('/auth/signin')
    }

})