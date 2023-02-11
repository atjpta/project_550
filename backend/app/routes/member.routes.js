
const controller = require("../controllers");
const ctl = controller.member;

const middlewares = require("../middlewares");
const memberMid = middlewares.memberMid;

const express = require("express");

module.exports = (app) => {

    const router = express.Router();
    router.route("/")
        .get(ctl.findAll)
        .post([memberMid.check_request], ctl.create)
        .delete(ctl.deleteAll)
    
    router.route('/team/:id')
        .get(ctl.findByTeam)
    
    router.route('/request/:id')
        .get( ctl.findByRequestTeam)

    router.route('/:id')
        .get(ctl.findOne)
        .put(ctl.update)
        .delete(ctl.delete)


    app.use("/api/member", router);


};