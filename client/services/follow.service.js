import { alertStore } from "~~/stores/alert.store";
import config from "~~/config";
import { authStore } from "~~/stores/auth.store";
const useAuth = authStore()
const useAlert = alertStore()
const url = config.url.api + '/follow'

export default {

    findByFollow: async (user, follow) => {
        const { data: data, error } = await useFetch(url + `/${user}/${follow}`, {
            headers: {
                authorization: authStore().getToken
            },
            method: "get",
        })
     
        return data.value
    },

    findByMy: async (urlcustom, id) => {
        const { data: data, error } = await useFetch(url + `/${urlcustom}/${id}`, {
            headers: {
                authorization: authStore().getToken
            },
            method: "get",
        })
        return data.value
    },

    create: async (dataO) => {
        const { data: data, error } = await useFetch(url + '', {
            headers: {
                authorization: authStore().getToken
            },
            body: dataO,
            method: "post",
        })

        useAlert.setSuccess("theo dõi thành công");
        return data.value
    },

    deleteOne: async (id) => {
        const { data: data, error } = await useFetch(url + `/${id}`, {
            headers: {
                authorization: authStore().getToken
            },
            method: "delete",
        })

        useAlert.setSuccess("hủy theo dõi thành công");

        return data.value
    },
} 