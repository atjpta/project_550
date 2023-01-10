const express = require("express");
const multer = require('../config/multer')
const image = require('../controllers/Image.controller')
const middlewares = require("../middlewares");
const checkname = middlewares.checkFileName;
module.exports = (app) => {
    const router = express.Router();

    router.route('/')
        .post( image.uploadImage)
    
    router.route('/:filename')
        .get(image.getImage)
        .post([checkname.ckeckNameImage], image.uploadImage)
    
    router.route('/upload/multi')
        .post(image.uploadImageMulti)
    
    app.use("/api/image", router);
}