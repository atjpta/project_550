import { defineStore } from "pinia";
import imageService from "~~/services/image.service";
import config from "~~/config";
export const imageStore = defineStore("imageStore", {
    id: 'image',
    state() {
        return {
            previewImage: null,
            image: null,
            url: null,
            name: null,
            loading: false,
        };
    },
    getters: {
    },
    actions: {

        convertToValidFileName(str) {
            // Chuyển đổi chuỗi tiếng Việt sang dạng không dấu
            str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            // Loại bỏ các ký tự không hợp lệ
            str = str.replace(/[^a-zA-Z0-9_\-]/g, "");

            // Thay thế khoảng trắng bằng dấu gạch ngang
            str = str.replace(/\s+/g, "-");

            // Giới hạn độ dài tên file
            str = str.substring(0, 50);

            return str;
        },



        async previewFiles(event) {
            this.reset();
            const file = event.target.files[0];
            const theReader = new FileReader();
            theReader.onloadend = async () => {
                this.previewImage = await theReader.result;
            };
            theReader.readAsDataURL(file);
            this.image = file
            const fileExt = file.name.split('.').pop()
            this.name = this.convertToValidFileName(file.name.split('.')[0]) + `.${fileExt}`;
            this.url = config.url.apiimage + file.name;
            console.log(this.url);

        },


        async uploadImage() {
            await imageService.upload(this.name, this.image);
            this.previewImage = null
            this.image = null
            return this.url;
        },

        reset() {
            this.previewImage = null;
            this.image = null;
            this.url = null;
        },
    }
}

);
