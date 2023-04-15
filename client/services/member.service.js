import { alertStore } from "~~/stores/alert.store";
import config from "~~/config";
import { authStore } from "~~/stores/auth.store";
const useAuth = authStore()
const useAlert = alertStore()
const url = config.url.api + '/member'

export default {

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
        useAlert.setSuccess("sửa thành công");
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

    findIsMember: async (team, user) => {
        const { data: data, error } = await useFetch(url + `/${team}/${user}`, {
            headers: {
                authorization: authStore().getToken
            },
            method: "get",
        })
        return data.value
    },

    findByTeam: async (id) => {
        const { data: data, error } = await useFetch(url + `/team/${id}`, {
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

    findTeamByUser: async (id) => {
        const { data: data, error } = await useFetch(url + `/myteam/${id}`, {
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

    findByRequestTeam: async (id) => {
        const { data: data, error } = await useFetch(url + `/request/${id}`, {
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
            useAlert.setError(error.value.data.message)
            throw new Error(error.value.data);
        }

        useAlert.setSuccess("Xin vào thành công");
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
        // useAlert.setSuccess("thao tác thành công");

        return data.value
    },

    deleteAllByTeam: async (id) => {
        const { data: data, error } = await useFetch(url + `/team/${id}`, {
            headers: {
                authorization: authStore().getToken
            },
            method: "delete",
        })

        if (error.value) {
            throw new Error(error.value.data);
        }

        return data.value
    },
} 