const mongoose = require("mongoose");
const DB = require("../models");
const model = DB.team;
const member = DB.member
const role = DB.role
exports.create = async (req, res, next) => {
    const modelO = new model({
        image_cover_url: req.body.image_cover_url,
        name: req.body.name,
        introduce: req.body.introduce,
        status: req.body.status,
    })
    try {
        await modelO.save((error, doc) => { 
            if (error) {
                return res.status(500).send({ message: error + 'không lưu được' });
            }
            role.findOne({ name: 'chief' }).exec((error_role, doc_role) => {
                if (error_role) {
                    return res.status(500).send({ message: error + 'không lưu được' });
                }
                const memberO = new member({
                    user: req.body.user,
                    team: doc.id,
                    role: doc_role.id
                })
                memberO.save((error_member, doc_member) => {
                    if (error_member) {
                        return res.status(500).send({ message: error + 'không lưu được' });
                    }
                    return res.send({ Message: 'tạo thành công' + doc.id });
                });
            })

        });
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể create model' + error })
        )
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const document = await model.find({ _id: { $ne: req.params.id } })
        return res.json(document);
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findAll' + error })
        )
    }
};

exports.findByUser = async (req, res, next) => {
    const { id } = req.params;

    try {
        const document = await member.find({ user: id }).populate({
            path: 'team'
        })
        if (!document) {
            return next(res.status(404).json({ Message: "không thể tìm thấy model" }));
        }
        return res.json(document);
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findAll' + error })
        )
    }
}

exports.findOne = async (req, res, next) => {
    const { id } = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id : null,
    };

    try {
        const document = await model.findOne(condition)
        if (!document) {
            return next(res.status(404).json({ Message: "không thể tìm thấy model" }));
        }
        return res.json(document);
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findAll' + error })
        )
    }
}

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(
            res.status(400).json({ Message: "thông tin không thế thay đổi" })
        )
    }
    const { id } = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id : null,
    };

    try {
        const document = await model.findByIdAndUpdate(condition, req.body, {
            new: true
        });
        if (!document) {
            return next(res.status(404).json({ Message: "không thể tìm thấy model" }));
        }
        return res.send({ message: "đã update thành công", body: req.body });
    }
    catch (error) {
        console.log(error);
        return next(
            res.status(500).json({ Message: ` không thể update model với id = ${req.params.id} ` })
        )
    }
}


exports.delete = async (req, res, next) => {
    const { id } = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id : null,
    };

    try {
        const document = await model.findOneAndDelete(condition);
        if (!document) {
            return next(res.status(404).json({ Message: "không thể tìm thấy model" }));
        }
        return res.send({ message: "đã xóa model thành công" });
    }
    catch (error) {
        return next(
            res.status(500).json({ Message: ` không thể xóa model với id = ${req.params.id} ` + error })
        )
    }
}
exports.deleteAll = async (req, res, next) => {
    try {
        const data = await model.deleteMany({});
        return res.send({ message: `${data.deletedCount}  model đã xóa thành công` });
    }
    catch (error) {
        return next(
            res.status(500).json({ Message: ` có lỗi khi đang xóa tất cả model` + error })
        )
    }
}



