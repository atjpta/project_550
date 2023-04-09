const mongoose = require("mongoose");
const DB = require("../models");
const model = DB.member;
const ObjectId = mongoose.Types.ObjectId;

exports.create = async (req, res, next) => {
    const modelO = new model({
        team: req.body.team,
        user: req.body.user,
        role: req.body.role,
        is_member: req.body.is_member,
    })
    try {
        const document = modelO.save();
        return res.send({ Message: 'tạo thành công' });
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể create model' + error })
        )
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const document = await model.find()
        return res.json(document);
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findAll' + error })
        )
    }
};



exports.findTeamByUser = async (req, res, next) => {
    const { id } = req.params;

    try {
        const document = await model.find({ user: id, is_member: true })
            .populate('role')
            .populate({
                path: 'team',
                select: 'name image_cover_url introduce tag createdAt',
                populate: {
                    path: 'tag',
                    select: 'id name'
                },
            }).sort({
                'createdAt': -1,
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

exports.findByTeam = async (req, res, next) => {
    const { id } = req.params;

    try {
        const document = await model.find({ team: id, is_member: true })
            .populate({
                path: 'user role',
                select: 'name avatar_url',
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

exports.findByRequestTeam = async (req, res, next) => {
    const { id } = req.params;

    try {
        const document = await model.find({ team: id, is_member: false })
            .populate({
                path: 'user role',
                select: 'name avatar_url',
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

exports.findIsMember = async (req, res, next) => {
    const { team, user } = req.params;
    try {
        const document = await model.findOne({ is_member: true, team: team, user: user }).populate('role', 'id name')
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

exports.deleteAllByTeam = async (req, res, next) => {
    const { id } = req.params
    try {
        const data = await model.deleteMany({ team: ObjectId(id) });
        return res.send({ message: `${data.deletedCount}  model đã xóa thành công` });
    }
    catch (error) {
        return next(
            res.status(500).json({ Message: ` có lỗi khi đang xóa tất cả model` + error })
        )
    }
}



