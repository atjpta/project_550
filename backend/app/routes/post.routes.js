const controller = require("../controllers");
const ctl = controller.post;

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
    
    router.route('/team/:id/')
        .get(ctl.findByTeam)
    
    router.route('/author/:id/')
        .get(ctl.findByAuthor)
    
    router.route('/series/:id/')
        .get(ctl.findBySeries)
        .put(ctl.updateSeries)
    
    router.route('/noseries/:id')
        .get(ctl.findByNoSeries)
    
    router.route('/:id/:user')
        .get(ctl.findOne)
    
    router.route('/:id/')
        .get(ctl.findOneGuest)
        .put(ctl.update)
        .delete(ctl.delete)
    
    
    


    app.use("/api/post", router);


};