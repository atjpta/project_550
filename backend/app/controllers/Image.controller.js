const mongoose = require("mongoose");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const uri = require("../config").db.uri;
const middlewares = require('../middlewares')
const Image = require('../models').image


const uploadSingle = multer({
  storage: new GridFsStorage({
    url: uri,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: "image"
        };
        resolve(fileInfo);
      });
    }
  })
}).single('image');

const uploadMulti = multer({
  storage: new GridFsStorage({
    url: uri,
    file: (req, file) => {
      console.log(file);
      return new Promise((resolve, reject) => {
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: "image"
        };
        resolve(fileInfo);
      });
    }
  })
}).array('image');

let bucketImage;
mongoose.connection.on("connected", () => {
  var client = mongoose.connections[0].client;
  var db = mongoose.connections[0].db;
  bucketImage = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "image",
  });
});

exports.uploadImage = (req, res, next) => {
  uploadSingle(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log('A Multer error occurred when uploading.');
    } else if (err) {
      console.log('An unknown error occurred when uploading + ' + err);
    }
    return res.status(200).send(req.file);
  })
};

exports.uploadImageMulti = (req, res, next) => {
  uploadMulti(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log('A Multer error occurred when uploadImageMulti.' + err);
    } else if (err) {
      console.log('An unknown error occurred when uploadImageMulti + ' + err);
    }
    return res.status(200).send(req.file);
  })
};

exports.getImage = async (req, res) => {
  const file = bucketImage
    .find({
      filename: req.params.filename,
    })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "no files exist",
        });
      }
      bucketImage.openDownloadStreamByName(req.params.filename).pipe(res);
    });
};
