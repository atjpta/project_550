// có 6 router chung là thêm(create), sửa (update), lấy tất cả (findAll), lấy theo id (findOne), xóa theo id (deleteOne), xóa tất cả(deleteAll)
// sẽ có các router khác đi kèm theo nữa tùy nào thực tế
// chú ý chỉnh ctl và url lại 

const controller = require("../controllers");
const ctl = controller.course;
const express = require("express");

module.exports = (app) => {

    const router = express.Router();
    router.route("/")
        .get(ctl.findAll)
        .post(ctl.create)
        .delete(ctl.deleteAll)

    router.route("/maxlength")
        .get(ctl.maxLength)

    router.route("/maxlength/:type")
        .get(ctl.maxLengthType)

    router.route('/delta/:id')
        .get(ctl.findOneDelta)

    router.route("/:page/:size")
        .get(ctl.findPerPage)

    router.route("/:type/:page/:size")
        .get(ctl.findPerPageType)

    router.route('/:id')
        .get(ctl.findOne)
        .put(ctl.update)
        .delete(ctl.delete)


    app.use("/api/course", router);


};