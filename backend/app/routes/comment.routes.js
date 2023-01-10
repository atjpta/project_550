const controller = require("../controllers");
const ctl = controller.comment;

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

    router.route('/:id')
        .get(ctl.findOne)
        .put(ctl.update)
        .delete(ctl.delete)
    
    router.route('/:type/:id')
        .get(ctl.getByGuest)
    
    router.route('/:type/:id/:user')
        .get(ctl.getBy)
    
    


    app.use("/api/comment", router);


};