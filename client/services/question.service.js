import { alertStore } from "~~/stores/alert.store";
import config from "~~/config";
import { authStore } from "~~/stores/auth.store";
const useAuth = authStore()
const useAlert = alertStore()
const url = config.url.api + '/question'

export default {

    findOther: async (id, tag) => {
        let customUrl = url
        if (tag) {
            customUrl += `/other/${id}/${tag}`;
        }
        else {
            customUrl += `/random/${id}`;
        }
        const { data: data, error } = await useFetch(customUrl, {
            method: "get",
        })
        if (error.value) {
            // useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        return data.value
    },

    findByCourse: async (id) => {
        const { data: data, error } = await useFetch(url + `/course/${id}`, {
            method: "get",
        })
        if (error.value) {
            // useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        return data.value
    },

    findByAdmin: async (id) => {
        const { data: data, error } = await useFetch(url + `/admin`, {
            method: "get",
        })
        if (error.value) {
            useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        return data.value
    },

    findPerFilter: async (filter, page, size) => {
        const { data: data, error } = await useFetch(url + `/${filter}/${page}/${size}`, {
            method: "get",
        })
        if (error.value) {
            throw new Error(error.value.data);
        }
        return data.value
    },


    findByOther: async (id) => {
        const { data: data, error } = await useFetch(url + `/other/${id}`, {
            method: "get",
        })
        if (error.value) {
            useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        return data.value
    },
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

    findByTopic: async (id) => {
        const { data: data, error } = await useFetch(url + `/topic/${id}`, {
            method: "get",
        })
        if (error.value) {
            useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        return data.value
    },

    findByNoTopic: async (id) => {
        const { data: data, error } = await useFetch(url + `/notopic/${id}`, {
            method: "get",
        })
        if (error.value) {
            useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        return data.value
    },

    updateTopic: async (id, dataO) => {
        if (dataO) {
            var { data: data, error } = await useFetch(url + `/topic/${id}`, {
                headers: {
                    authorization: authStore().getToken
                },
                body: dataO,
                method: "put",
            })
        } else {
            var { data: data, error } = await useFetch(url + `/topic/${id}`, {
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
        // useAlert.setSuccess("test thành công");
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
            useAlert.setWarning('không có trang này')
            navigateTo('/')
            // useAlert.setError(error.value.data)

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
            useAlert.setError('không có trang này')
            return navigateTo('/')
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
        useAlert.setSuccess("tạo thành công!! hãy chờ duyệt câu hỏi");
        return data.value
    },
} 