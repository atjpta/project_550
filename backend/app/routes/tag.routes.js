const controller = require("../controllers");
const ctl = controller.tag;

const middlewares = require("../middlewares");
const verifySignUp = middlewares.verifySignUp;
const authJwt = middlewares.authJwt;
const checkDuplicate = middlewares.withoutDuplicates
const express = require("express");

module.exports = (app) => {

    const router = express.Router();
    router.route("/admin")
        .get(ctl.findByAdmin)
    router.route("/info")
        .get(ctl.findAllInfo)
    router.route('/all')
        .post(ctl.createAll)



    router.route("/")
        .get(ctl.findAll)
        .post([checkDuplicate.check_tag], ctl.create)
        .delete(ctl.deleteAll)

    router.route("/info/:page/:size")
        .get(ctl.findAllInfoPage)

    router.route('/author/:id')
        .get(ctl.findByAuthor)

    router.route('/:id')
        .get(ctl.findOne)
        .put(ctl.update)
        .delete(ctl.delete)



    app.use("/api/tag", router);


};