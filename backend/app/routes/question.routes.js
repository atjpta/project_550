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

    router.route("/admin")
        .get(ctl.findByAdmin)

    router.route('/other/:id/:tag')
        .get(ctl.findOtherByTag)

    router.route('/:filter/:page/:size')
        .get(ctl.findPerFilter)

    router.route('/course/:id/')
        .get(ctl.findByCourse)

    router.route('/random/:id/')
        .get(ctl.findRandom)

    router.route('/edit/:id/')
        .get(ctl.findOneEdit)

    router.route('/team/:id/')
        .get(ctl.findByTeam)

    router.route('/tag/:id/')
        .get(ctl.findByTag)

    router.route('/author/:id/')
        .get(ctl.findByAuthor)

    router.route('/other/:id/')
        .get(ctl.findByOther)

    router.route('/topic/:id/')
        .get(ctl.findByTopic)
        .put(ctl.updateTopic)

    router.route('/notopic/:id')
        .get(ctl.findByNoTopic)

    router.route('/:id/:user')
        .get(ctl.findOne)

    router.route('/:id/')
        .get(ctl.findOneGuest)
        .put(ctl.update)
        .delete(ctl.delete)

    app.use("/api/question", router);


};