const controller = require("../controllers");
const ctl = controller.user;

const middlewares = require("../middlewares");
const verifySignUp = middlewares.verifySignUp;
const authJwt = middlewares.authJwt;
const express = require("express");

module.exports = (app) => {

    const router = express.Router();
    router.route("/")
        .get(ctl.findAll)
        .delete(ctl.deleteAll)

    router.route("/admin")
        .get(ctl.findByAdmin)

    router.route("/maxlength")
        .get(ctl.maxLength)

    router.route("/alloverview")
        .get(ctl.findAllOverView)

    router.route("/alloverview/:page/:size")
        .get(ctl.findAllOverViewPage)

    router.route('/overview/:id')
        .get(ctl.findOverView)

    router.route('/:id')
        .get(ctl.findOne)
        .put(ctl.update)
        .delete(ctl.delete)


    app.use("/api/user", router);


};