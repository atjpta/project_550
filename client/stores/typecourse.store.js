import { defineStore } from "pinia";
import typecourseService from "~~/services/typecourse.service";
export const typecourseStore = defineStore("typecourseStore", {
    id: 'typecourse',
    state() {
        return {
            list: [],
            typecourse: {},
            maxLength: 0,
        };
    },
    getters: {

    },
    actions: {
        getRandomColorByKey(key) {
            var letters = '123456789ABCDEF'; // Các ký tự được sử dụng để tạo mã màu
            var color = '#'; // Chuỗi mã màu bắt đầu với dấu # (ví dụ: "#FF00FF")

            // Lặp qua các ký tự trong key
            for (var i = 0; i < 2; i++) {
                // Chuyển đổi ký tự thành mã Unicode và lấy phần dư cho 16 để chọn một ký tự ngẫu nhiên từ chuỗi letters
                // var charCode = key.charCodeAt(i);
                // var randomIndex = charCode % 16;
                var randomIndex = (Math.floor(Math.random() * 15))
                color += letters[randomIndex];
            }
            color += '00ff33'
            // console.log(color);
            return color;
        },
        async findAll() {
            this.list = await typecourseService.findAll();
            return this.list
        },
        async findPerPage(page, size) {
            this.list = await typecourseService.findPerPage(page, size);
        },
        async update(data) {
            await typecourseService.update(data);
        },
        async create(data) {
            await typecourseService.create(data);
        },
        async deleteOne(id) {
            await typecourseService.deleteOne(id);
        },
        async getMaxLength() {
            this.maxLength = await typecourseService.maxLength();
        },


    }
});
