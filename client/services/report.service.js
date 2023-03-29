import { alertStore } from "~~/stores/alert.store";
import config from "~~/config";
import { authStore } from "~~/stores/auth.store";
const useAuth = authStore()
const useAlert = alertStore()
const url = config.url.api + '/report'

export default {

    delete: async (id) => {
        const { data: data, error } = await useFetch(url + `/${id}`, {
            headers: {
                authorization: authStore().getToken
            },
            method: "delete",
        })
        if (error.value) {
            useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        useAlert.setSuccess("xóa thành công");
        return data.value
    },

    deleteByModel: async (id) => {
        const { data: data, error } = await useFetch(url + `/model/${id}`, {
            headers: {
                authorization: authStore().getToken
            },
            method: "delete",
        })
        if (error.value) {
            useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        useAlert.setSuccess("xóa thành công");
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
        if (error.value) {
            useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        useAlert.setSuccess("báo cáo thành công");
        console.log(data.value);
        return data.value
    },
} 