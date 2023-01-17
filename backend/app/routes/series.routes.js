const controller = require("../controllers");
const ctl = controller.series;

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
    
    router.route('/my/:id')
        .get(ctl.findByUser)
    
    router.route('/edit/:id')
        .get(ctl.findOneEdit)

    app.use("/api/series", router);
}
