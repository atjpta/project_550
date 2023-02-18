const controller = require("../controllers");
const ctl = controller.team;

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
    
    router.route('/my/:id')
        .get(ctl.findByUser)
    
    router.route('/edit/:id/')
        .get(ctl.findOneEdit)
    
    router.route('/tag/:id/')
        .get(ctl.findByTag)
    

    router.route('/:id')
        .get(ctl.findOne)
        .put(ctl.update)
        .delete(ctl.delete)
    
    


    app.use("/api/team", router);


};