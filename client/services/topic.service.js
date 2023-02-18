import { alertStore } from "~~/stores/alert.store";
import config from "~~/config";
import { authStore } from "~~/stores/auth.store";
const useAuth = authStore()
const useAlert = alertStore()
const url = config.url.api + '/topic'

export default {

    findByAuthor: async (id) => {
        const { data: data, error } = await useFetch(url + `/author/${id}`, {
            method: "get",
        })
        if (error.value) {
            useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        return data.value
    },

    findByTag: async (id) => {
        const { data: data, error } = await useFetch(url + `/tag/${id}`, {
            method: "get",
        })
        if (error.value) {
            useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        return data.value
    },

    findByTeam: async (id) => {
        const { data: data, error } = await useFetch(url + `/team/${id}`, {
            method: "get",
        })
        if (error.value) {
            useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        return data.value
    },

    findByUserTeam: async (id, team) => {
        const { data: data, error } = await useFetch(url + `/my/${id}/${team}`, {
            method: "get",
        })
        if (error.value) {
            useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        return data.value
    },

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

    getEdit: async () => {
        const { data: data, error } = await useFetch(url + '/getedit', {
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

    findOne: async (id) => {
        const { data: data, error } = await useFetch(url + `/${id}`, {
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

    findOneEdit: async (id) => {
        const { data: data, error } = await useFetch(url + `/edit/${id}`, {
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

    findByUser: async (id) => {
        const { data: data, error } = await useFetch(url + `/my/${id}`, {
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
        useAlert.setSuccess("tạo thành công");
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
            useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        useAlert.setSuccess("Sửa thành công");
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
            useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        useAlert.setSuccess("xóa thành công");
        return data.value
    },


} 