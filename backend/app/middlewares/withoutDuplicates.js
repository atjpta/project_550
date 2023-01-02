const db = require('../models')
const tag = db.tag;

exports.check_tag = (req, res, next) => {
  // Username
  tag.findOne({
    name: req.body.name,
  }).exec((err, tag) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (tag) {
      res.status(400).send({ message: "Failed! tag đã được sử dụng!" });
      return;
    }
   next();
  });
};


