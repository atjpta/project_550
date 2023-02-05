const controller = require("../controllers");
const ctl = controller.answer;

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

    router.route('/:id/:user')
        .get(ctl.getBy)
    
    router.route('/:id')
        .get(ctl.getByGuest)
        .put(ctl.update)
        .delete(ctl.delete)

    




    app.use("/api/answer", router);


};