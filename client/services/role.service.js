import { alertStore } from "~~/stores/alert.store";
import config from "~~/config";
import { authStore } from "~~/stores/auth.store";
const useAuth = authStore()
const useAlert = alertStore()
const url = config.url.api + '/role'

export default {

    findAll: async () => {
        const { data: data, error } = await useFetch(url + '', {
            headers: {
                authorization: authStore().getToken
            },
            method: "get",
        })

        if (error.value) {
            useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        // useAlert.setSuccess("test thành công");
        return data.value
    },

} 