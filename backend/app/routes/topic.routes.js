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
    
    router.route("/admin")
        .get(ctl.findByAdmin)
    
    router.route('/my/:id/:team')
        .get(ctl.findByUserTeam)
    
    router.route('/:filter/:page/:size')
        .get(ctl.findPerFilter)
    
    router.route('/edit/:id')
        .get(ctl.findOneEdit)
    
    router.route('/tag/:id')
        .get(ctl.findByTag)
    
    router.route('/team/:id')
        .get(ctl.findByTeam)
    
    router.route('/author/:id')
        .get(ctl.findByAuthor)
    
    router.route('/other/:id/')
        .get(ctl.findByOther)

    router.route('/:id')
        .get(ctl.findOne)
        .put(ctl.update)
        .delete(ctl.delete)

    

    app.use("/api/topic", router);
}
