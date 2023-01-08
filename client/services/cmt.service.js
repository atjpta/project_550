import { alertStore } from "~~/stores/alert.store";
import config from "~~/config";
import { authStore } from "~~/stores/auth.store";
const useAuth = authStore()
const useAlert = alertStore()
const url = config.url.api + '/comment'

export default {

    create: async (dataO) => {
        const { data: data, error } = await useFetch(url + '', {
            headers: {
                authorization: authStore().getToken
            },
            body: dataO,
            method: "post",
        })

        if (error.value) {
            useAlert.setError(error.value.data.message)
            throw new Error(error.value.data.message);
        }
        useAlert.setSuccess("gửi bình luận thành công");
        return data.value
    },
    getBy: async (type, id) => {
        const { data: data, error } = await useFetch(url + `/${type}/${id}`, {
            headers: {
                authorization: authStore().getToken
            },
            method: "get",
        })

        if (error.value) {
            useAlert.setError(error.value.data.message)
            throw new Error(error.value.data.message);
        }
        return data.value
    },
} 