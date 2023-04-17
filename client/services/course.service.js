import { alertStore } from "~~/stores/alert.store";
import config from "~~/config";
import { authStore } from "~~/stores/auth.store";
const useAuth = authStore()
const useAlert = alertStore()
const url = config.url.api + '/course'

export default {

    maxLengthType: async (type) => {
        const { data: data, error } = await useFetch(url + `/maxlength/${type}`, {
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

    findPerPageType: async (type, page, size) => {
        const { data: data, error } = await useFetch(url + `/${type}/${page}/${size}`, {
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

    maxLength: async () => {
        const { data: data, error } = await useFetch(url + `/maxlength`, {
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

    findPerPage: async (page, size) => {
        const { data: data, error } = await useFetch(url + `/${page}/${size}`, {
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

    findAll: async () => {
        const { data: data, error } = await useFetch(url, {
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
            // useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        // useAlert.setSuccess("thao tác thành công");
        return data.value
    },

    findOneDelta: async (id) => {
        const { data: data, error } = await useFetch(url + `/delta/${id}`, {
            headers: {
                authorization: authStore().getToken
            },
            method: "get",
        })

        if (error.value) {
            // useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        // useAlert.setSuccess("thao tác thành công");
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
        // useAlert.setSuccess("thao tác thành công");
        return data.value
    },
} 