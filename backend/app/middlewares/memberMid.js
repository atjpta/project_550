const db = require('../models')
const models = db.member;

exports.check_request = (req, res, next) => {
    // Username
    models.findOne({
        user: req.body.user,
        team: req.body.team,
    }).exec((err, member) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (member) {
            res.status(400).send({ message: "Failed! đã xin vào nhóm rồi, hãy chờ đợi đi! " });
            return;
        }
        next();
    });
};


