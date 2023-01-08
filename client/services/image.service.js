import { alertStore } from "~~/stores/alert.store";
import config from "~~/config";
import { authStore } from "~~/stores/auth.store";
const useAuth = authStore()
const useAlert = alertStore()
const url = config.url.api + '/image'

export default {
    uploadImage: async (image, name) => {
        const { data: data, error } = await useFetch(url+`/${name}` , {
            method: "POST",
            body: image
        })

        if (error.value) {
            if (error.value.status == 400) {
                return;
            }
            useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        useAlert.setSuccess("tải ảnh lên thành công");
        return data.value
    },
    uploadImageMulti: async (list) => {
        const { data: data, error } = await useFetch(url + '/upload/multi', {
            method: "POST",
            body: list
        })

        if (error.value) {
            useAlert.setError(error.value.data)
            throw new Error(error.value.data);
        }
        useAlert.setSuccess("tải ảnh lên thành công");
        return data.value
    },
} 