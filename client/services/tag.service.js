import { alertStore } from "~~/stores/alert.store";
import config from "~~/config";
import { authStore } from "~~/stores/auth.store";
const useAuth = authStore()
const useAlert = alertStore()
const url = config.url.api + '/tag'

export default {

    findByAdmin: async (id) => {
        const { data: data, error } = await useFetch(url + `/admin`, {
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

    findAllInfo: async () => {
        const { data: data, error } = await useFetch(url + '/info', {
            headers: {
                authorization: authStore().getToken
            },
            method: "get",
        })

        if (error.value) {
            // useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        // useAlert.setSuccess("test thành công");
        return data.value
    },

    findAllInfoPage: async (page, size) => {
        const { data: data, error } = await useFetch(url + `/info/${page}/${size}`, {
            headers: {
                authorization: authStore().getToken
            },
            method: "get",
        })

        if (error.value) {
            // useAlert.setError(error.value.data)
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
            useAlert.setWarning('không có trang này')
            navigateTo('/')
            // useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        // useAlert.setSuccess("test thành công");
        return data.value
    },

    findByAuthor: async (id) => {
        const { data: data, error } = await useFetch(url + `/author/${id}`, {
            headers: {
                authorization: authStore().getToken
            },
            method: "get",
        })

        if (error.value) {
            // useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        // useAlert.setSuccess("test thành công");
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
            // useAlert.setError(error.value.data)
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
            // useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        useAlert.setSuccess("tạo thành công");
        return data.value
    },

    createAll: async (dataO) => {
        const { data: data, error } = await useFetch(url + '/all', {
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
        useAlert.setSuccess("tạo thành công");
        return data.value
    },
} 