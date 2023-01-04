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

            listPreviewImage: [],
            listImage: null,
            listUrl: [],
        };
    },
    getters: {
    },
    actions: {

        async previewListFiles(event) {
            this.resetList()
            const file = event.target.files;
            for (let i = 0; i < file.length; i++) {
                const theReader = new FileReader();
                theReader.onloadend = async () => {
                    this.listPreviewImage.push(await theReader.result)
                };
                theReader.readAsDataURL(file[i]);
                let formData = new FormData();
                this.listImage.append('image', file[i]);
                this.listUrl.push(config.url.apiimage + '/' + file[i].name)
            };
        },
        async uploadListImage() {
            await imageService.uploadImageMulti(this.listImage);
            this.listPreviewImage = [];
            this.listImage = [];
            return this.listUrl;
        },

        async previewFiles(event) {
            this.reset();
            const file = event.target.files[0];
            const theReader = new FileReader();
            theReader.onloadend = async () => {
                this.previewImage = await theReader.result;
            };
            theReader.readAsDataURL(file);
            this.image = new FormData();
            this.image.append("image", file);
            this.url = config.url.apiimage + '/' + file.name;
            this.name = file.name;
            console.log(this.url);

        },

        async uploadImage() {
            await imageService.uploadImage(this.image, this.name);
            this.previewImage = null
            this.image = null
            return this.url;
        },

        reset() {
            this.previewImage = null;
            this.image = null;
            this.url = null;
        },

        resetList() {
            this.listPreviewImage = [];
            this.listImage = new FormData();
            this.listUrl = [];
        }
    }
}

);
