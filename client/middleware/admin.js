import { alertStore } from "~~/stores/alert.store";
import { userStore } from "~~/stores/user.store";

// thông tin user lấy từ store pinia
const useAlert = alertStore()
const useUser = userStore()

export default defineNuxtRouteMiddleware((to, from) => {
    if (from.path.slice(0, 6) != '/admin') {
        if (!useUser.isAdmin) {
            useAlert.setWarning('bạn không có quyền truy cập');
            return navigateTo('/')
        }
    }
    else {
        return;
    }
})


