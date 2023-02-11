import { alertStore } from "~~/stores/alert.store";
import config from "~~/config";
import { authStore } from "~~/stores/auth.store";
const useAuth = authStore()
const useAlert = alertStore()
const url = config.url.api + '/post'

export default {

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

    findBySeries: async (id) => {
        const { data: data, error } = await useFetch(url + `/series/${id}`, {
            method: "get",
        })
        if (error.value) {
            useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        return data.value
    },

    findByNoSeries: async (id) => {
        const { data: data, error } = await useFetch(url + `/noseries/${id}`, {
            method: "get",
        })
        if (error.value) {
            useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        return data.value
    },

    updateSeries: async (id, dataO) => {
        if (dataO) {
            var { data: data, error } = await useFetch(url + `/series/${id}`, {
                headers: {
                    authorization: authStore().getToken
                },
                body: dataO,
                method: "put",
            })
        } else {
            var { data: data, error } = await useFetch(url + `/series/${id}`, {
                headers: {
                    authorization: authStore().getToken
                },
                method: "put",
            })
        }

        if (error.value) {
            useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        // useAlert.setSuccess("test thành công");
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
        // useAlert.setSuccess("sửa thành công");
        return data.value
    },

    findAll: async () => {
        const { data: data, error } = await useFetch(url + '', {
            
            method: "get",
        })

        if (error.value) {
            useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
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

    findOne: async (id, user) => {
        let apiurl = url + `/${id}`
        if (!!user) {
            apiurl = url + `/${id}/${user}`
        }
        const { data: data, error } = await useFetch(apiurl, {
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
        let apiurl = url + `/edit/${id}`
        const { data: data, error } = await useFetch(apiurl, {
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
        console.log(data.value);
        return data.value
    },
} 