const db = require('../models')
const Hashtag = db.hashtag;

exports.checkDuplicateHashtag = (req, res, next) => {
  // Username
  Hashtag.findOne({
    name: req.body.name,
  }).exec((err, Hashtag) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (Hashtag) {
      res.status(400).send({ message: "Failed! Hashtag đã được sử dụng!" });
      return;
    }
   next();
  });
};


