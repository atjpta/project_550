const db = require('../models')
const models = db.follow;

exports.check_create = (req, res, next) => {
    // Username
    models.findOne({
        user: req.body.user,
        follow: req.body.follow,
    }).exec((err, model) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (model) {
            res.status(400).send({ message: "Failed! đã theo dõi r! " });
            return;
        }
        next();
    });
};


