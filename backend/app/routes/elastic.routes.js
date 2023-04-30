
const controller = require("../controllers");
const ctl = controller.elastic;
const express = require("express");

module.exports = (app) => {

    const router = express.Router();

    router.route('/')
        .get(ctl.create)
        .post(ctl.getDataFormDB)
        .delete(ctl.delete)

    app.use("/api/elastic", router);

};