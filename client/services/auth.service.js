import { alertStore } from "~~/stores/alert.store";
import config from "~~/config";
const useAlert = alertStore()
const url = config.url.api + '/auth'

export default {
    signin: async (user) => {
        const { data: data, error } = await useFetch(url + '/signin', {
            method: "POST",
            body: user
        })

        if (error.value) {
            useAlert.setError(error.value.data.message)
            throw new Error(error.value.data);
        }
        useAlert.setSuccess("Đăng nhập thành công ");
        return data.value
    },

    signup: async (user) => {
        const { data: data, error } = await useFetch(url + '/signup', {
            method: "POST",
            body: user
        })
        if (error.value) {
            useAlert.setError(error.value.data.message)
            throw new Error(error.value.data);
        }
        useAlert.setSuccess("Đăng kí thành công ");
        return data.value
    }
} 