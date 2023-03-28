const mongoose = require("mongoose");
const DB = require("../models");
const model = DB.tag;
const ObjectId = mongoose.Types.ObjectId;

exports.createAll = async (req, res, next) => {
    try {
        const document = model.insertMany(req.body, (error, docs) => {
            let list = [];
            docs.forEach((e) => {
                list.push(e.id);
            })
            return res.send(list);

        });
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể create model' + error })
        )
    }
};

exports.create = async (req, res, next) => {
    const modelO = new model({
        author: req.body.author,
        name: req.body.name,
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
        const document = await model.find({ _id: { $ne: req.params.id } }).select([
            "name",
            "id",
        ]);
        return res.json(document);
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findAll' + error })
        )
    }
};


exports.findAllInfo = async (req, res, next) => {
    try {
        const document = await model.aggregate([
            {
                $lookup: {
                    from: "posts",
                    localField: "_id",
                    foreignField: "tag",
                    as: "posts"
                }
            },
            {
                $lookup: {
                    from: "questions",
                    localField: "_id",
                    foreignField: "tag",
                    as: "questions"
                }
            },
            {
                $lookup: {
                    from: "teams",
                    localField: "_id",
                    foreignField: "tag",
                    as: "teams"
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    introduce: 1,
                    author: 1,
                    total_count: {
                        $add: [
                            { $size: "$posts" },
                            { $size: "$questions" },
                            { $size: "$teams" },
                        ]
                    }
                }
            },
            {
                $sort: { 'total_count': -1 }
            }
        ])
        return res.json(document);
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findAll' + error })
        )
    }
};


exports.findAllInfoPage = async (req, res, next) => {

    const size = parseInt(req.params.size)
    let skip = size * parseInt(req.params.page - 1)

    if (skip < 0) {
        skip = 0
    }
    try {
        const document = await model.aggregate([
            {
                $lookup: {
                    from: "posts",
                    localField: "_id",
                    foreignField: "tag",
                    as: "posts"
                }
            },
            {
                $lookup: {
                    from: "questions",
                    localField: "_id",
                    foreignField: "tag",
                    as: "questions"
                }
            },
            {
                $lookup: {
                    from: "teams",
                    localField: "_id",
                    foreignField: "tag",
                    as: "teams"
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    introduce: 1,
                    author: 1,
                    total_count: {
                        $add: [
                            { $size: "$posts" },
                            { $size: "$questions" },
                            { $size: "$teams" },
                        ]
                    }
                }
            },
            {
                $sort: { 'total_count': -1 }
            },
            {
                $skip: skip
            },
            {
                $limit: size
            },
        ])
        return res.json(document);
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findAll' + error })
        )
    }
};


exports.findByAuthor = async (req, res, next) => {
    const { id } = req.params;
    try {
        const document = await model.aggregate([
            {
                $match: {
                    author: ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "_id",
                    foreignField: "tag",
                    as: "posts"
                }
            },
            {
                $lookup: {
                    from: "questions",
                    localField: "_id",
                    foreignField: "tag",
                    as: "questions"
                }
            },
            {
                $lookup: {
                    from: "teams",
                    localField: "_id",
                    foreignField: "tag",
                    as: "teams"
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    introduce: 1,
                    total_count: {
                        $add: [
                            { $size: "$posts" },
                            { $size: "$questions" },
                            { $size: "$teams" },
                        ]
                    }
                }
            },
            {
                $sort: { 'total_count': -1 }
            }
        ])
        return res.json(document);
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findAll' + error })
        )
    }
};

exports.findOne = async (req, res, next) => {
    const { id } = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id : null,
    };

    try {
        const document = await model.findOne(condition).select([
            "name",
            "id",
            'introduce',
            'author',
        ]);
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



