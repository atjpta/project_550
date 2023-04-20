// có 6 router chung là thêm(create), sửa (update), lấy tất cả (findAll), lấy theo id (findOne), xóa theo id (deleteOne), xóa tất cả(deleteAll)
// sẽ có các router khác đi kèm theo nữa tùy nào thực tế
// chú ý chỉnh ctl và url lại 

const controller = require("../controllers");
const ctl = controller.follow;

const middlewares = require("../middlewares");
const mid = middlewares.followMid
const express = require("express");

module.exports = (app) => {

    const router = express.Router();
    router.route("/")
        .get(ctl.findAll)
        .post([mid.check_create], ctl.create)
        .delete(ctl.deleteAll)

    router.route('/myuser/:id')
        .get(ctl.findMyFollowUser)
    router.route('/mypost/:id')
        .get(ctl.findMyFollowPost)
    router.route('/myquestion/:id')
        .get(ctl.findMyFollowQuestion)
    router.route('/myseries/:id')
        .get(ctl.findMyFollowSeries)
    router.route('/mytopic/:id')
        .get(ctl.findMyFollowTopic)
    router.route('/myteam/:id')
        .get(ctl.findMyFollowTeam)
    router.route('/mytag/:id')
        .get(ctl.findMyFollowTag)
    router.route('/mycourse/:id')
        .get(ctl.findMyFollowCourse)

    router.route('/:id')
        .get(ctl.findOne)
        .put(ctl.update)
        .delete(ctl.delete)

    router.route('/:user/:follow')
        .get(ctl.findByFollow)


    app.use("/api/follow", router);


};