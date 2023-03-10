// có 6 router chung là thêm(create), sửa (update), lấy tất cả (findAll), lấy theo id (findOne), xóa theo id (deleteOne), xóa tất cả(deleteAll)
// sẽ có các router khác đi kèm theo nữa tùy nào thực tế
// chú ý chỉnh ctl và url lại 

const controller = require("../controllers");
const ctl = controller.notification;

const middlewares = require("../middlewares");
const verifySignUp = middlewares.verifySignUp;
const authJwt = middlewares.authJwt;
const checkDuplicate = middlewares.withoutDuplicates
const express = require("express");

module.exports = (app) => {

    const router = express.Router();

    // router.route("/admin")
    //     .post(ctl.createOne)

    router.route("/")
        .get(ctl.findAll)
        .post(ctl.create)
        .delete(ctl.deleteAll)
    
    router.route('/my/:id')
        .get(ctl.findByMy)
        .put(ctl.updateMarkAllByUser)
        .delete(ctl.deleteByMy)
    
    router.route('/:id')
        .get(ctl.findOne)
        .put(ctl.update)
        .delete(ctl.delete)


    app.use("/api/notification", router);


};