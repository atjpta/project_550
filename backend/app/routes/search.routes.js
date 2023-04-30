
const controller = require("../controllers");
const ctl = controller.search;
const express = require("express");

module.exports = (app) => {

    const router = express.Router();
    router.route('/:textsearch')
        .get(ctl.search)
    app.use("/api/search", router);

};