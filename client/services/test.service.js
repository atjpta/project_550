import { alertStore } from "~~/stores/alert.store";
import config from "~~/config";
import { authStore } from "~~/stores/auth.store";
const useAuth = authStore()
const useAlert = alertStore()
const url = config.url.api + '/auth'

export default {
    adminBoard: async () => {
        const { data: data, error } = await useFetch(url + '/test/admin', {
            headers: {
                authorization: authStore().getToken
            },
            method: "get",
        })

        if (error.value) {
            useAlert.setError(error.value.data.message)
            throw new Error(error.value.data.message);
        }
        useAlert.setSuccess("test thành công");
        return data.value
    },
} 