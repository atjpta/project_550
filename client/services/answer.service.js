import { alertStore } from "~~/stores/alert.store";
import config from "~~/config";
import { authStore } from "~~/stores/auth.store";
const useAuth = authStore()
const useAlert = alertStore()
const url = config.url.api + '/answer'

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
            // useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        useAlert.setSuccess("gửi câu trả lời thành công");
        return data.value
    },
    getBy: async (id, user, filter) => {
        let apiurl = url + `/${id}/${filter}`

        if (!!user) {
            apiurl = url + `/${id}/${user}/${filter}`
        }
        const { data: data, error } = await useFetch(apiurl, {
            headers: {
                authorization: authStore().getToken
            },
            method: "get",
        })

        if (error.value) {
            // useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        return data.value
    },
    update: async (dataO) => {
        const { data: data, error } = await useFetch(url + `/${dataO.id}`, {
            headers: {
                authorization: authStore().getToken
            },
            body: dataO,
            method: "put",
        })

        if (error.value) {
            // useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        useAlert.setSuccess("sửa thành công");
        return data.value
    },

    deleteOne: async (id) => {
        const { data: data, error } = await useFetch(url + `/${id}`, {
            headers: {
                authorization: authStore().getToken
            },
            method: "delete",
        })

        if (error.value) {
            // useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        useAlert.setSuccess("xóa thành công");

        return data.value
    },
} 