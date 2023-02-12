import { alertStore } from "~~/stores/alert.store";
import config from "~~/config";
import { authStore } from "~~/stores/auth.store";
const useAuth = authStore()
const useAlert = alertStore()
const url = config.url.api + '/vote'

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
        useAlert.setSuccess("đánh giá thành công");
        return data.value
    },

    findOne: async (id) => {
        const { data: data, error } = await useFetch(url + `/${id}`, {
            headers: {
                authorization: authStore().getToken
            },
            method: "get",
        })

        if (error.value) {
            useAlert.setError(error.value.data.message)
            throw new Error(error.value.data.message);
        }
        // useAlert.setSuccess("test thành công");
        return data.value
    },

    update: async (dataO, id) => {
        const { data: data, error } = await useFetch(url + `/${id}`, {
            headers: {
                authorization: authStore().getToken
            },
            body: dataO,
            method: "put",
        })

        if (error.value) {
            useAlert.setError(error.value.data.message)
            throw new Error(error.value.data.message);
        }
        // useAlert.setSuccess("test thành công");
        return data.value
    },
} 