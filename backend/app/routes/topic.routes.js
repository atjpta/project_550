const controller = require("../controllers");
const ctl = controller.topic;

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
    
    router.route('/getedit')
        .get(ctl.findAll2)
    
    router.route('/edit/:id')
        .get(ctl.findOneEdit)
    
    router.route('/team/:id')
        .get(ctl.findByTeam)

    router.route('/:id')
        .get(ctl.findOne)
        .put(ctl.update)
        .delete(ctl.delete)

    

    app.use("/api/topic", router);
}
