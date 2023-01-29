const controller = require("../controllers");
const ctl = controller.question;

const middlewares = require("../middlewares");
const verifySignUp = middlewares.verifySignUp;
const authJwt = middlewares.authJwt;
const checkDuplicate = middlewares.withoutDuplicates
const express = require("express");

module.exports = (app) => {

    const router = express.Router();
    router.route("/")
        .get(ctl.findAll)
        .post(ctl.create)
        .delete(ctl.deleteAll)

    router.route('/maxlength')
        .get(ctl.getLength)

    router.route('/edit/:id/')
        .get(ctl.findOneEdit)

    router.route('/series/:id/')
        .get(ctl.findByTopic)
        .put(ctl.updateTopic)

    router.route('/noseries/:id')
        .get(ctl.findByNoTopic)

    router.route('/:id/:user')
        .get(ctl.findOne)

    router.route('/:id/')
        .get(ctl.findOneGuest)
        .put(ctl.update)
        .delete(ctl.delete)

    app.use("/api/question", router);


};