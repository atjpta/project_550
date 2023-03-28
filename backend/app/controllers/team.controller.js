const mongoose = require("mongoose");
const DB = require("../models");
const model = DB.team;
const member = DB.member
const role = DB.role
const ObjectId = mongoose.Types.ObjectId;

exports.create = async (req, res, next) => {
    const modelO = new model({
        image_cover_url: req.body.image_cover_url ?? 'https://axqkgnmnmrlddosqokpa.supabase.co/storage/v1/object/public/blog-files/image/meo.jpg',
        name: req.body.name ?? 'tên nhóm nè ^^',
        introduce: req.body.introduce,
        status: req.body.status,
        tag: req.body.tag,
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
                console.log(req.body.user);
                const memberO = new member({
                    user: req.body.user,
                    team: doc.id,
                    role: doc_role.id,
                    is_member: true,
                })
                memberO.save((error_member, doc_member) => {
                    if (error_member) {
                        return res.status(500).send({ message: error + 'không lưu được' });
                    }
                    return res.send(doc.id);
                });
            })

        });
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể create model' + error })
        )
    }
};

exports.findAll2 = async (req, res, next) => {
    try {
        const document = await model.find({ _id: { $ne: req.params.id } }).populate({
            path: 'tag'
        }).sort({ 'createdAt': -1 })
        return res.json(document);
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findAll' + error })
        )
    }
};


exports.findAllPage = async (req, res, next) => {

    const size = parseInt(req.params.size)
    let skip = size * parseInt(req.params.page - 1)

    if (skip < 0) {
        skip = 0
    }
    try {
        const document = await model.aggregate([
            {
                $lookup: {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'team',
                    as: 'list_post',
                },

            },
            {
                $lookup: {
                    from: 'votes',
                    localField: 'list_post._id',
                    foreignField: 'post',
                    as: 'vote_post',
                    pipeline: [
                        {
                            $group: {
                                _id: '$post',
                                val: { $sum: '$val' },
                            },
                        }
                    ]
                },
            },

            {
                $lookup: {
                    from: 'questions',
                    localField: '_id',
                    foreignField: 'team',
                    as: 'list_question',
                },

            },
            {
                $lookup: {
                    from: 'votes',
                    localField: 'list_question._id',
                    foreignField: 'post',
                    as: 'vote_question',
                    pipeline: [
                        {
                            $group: {
                                _id: '$post',
                                val: { $sum: '$val' },
                            },
                        }
                    ]
                },
            },

            {
                $lookup: {
                    from: 'members',
                    localField: '_id',
                    foreignField: 'team',
                    as: 'member',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'roles',
                                localField: 'role',
                                foreignField: '_id',
                                as: 'role',
                            },
                        }
                    ]
                },
            },

            {
                $lookup: {
                    from: 'tags',
                    localField: 'tag',
                    foreignField: '_id',
                    as: 'tag',
                },
            },
            {
                $lookup: {
                    from: 'status',
                    localField: 'status',
                    foreignField: '_id',
                    as: 'status',
                },
            },
            {
                $project: {
                    "_id": 1,
                    'name': 1,
                    'introduce': 1,
                    'createdAt': 1,
                    'image_cover_url': 1,
                    "tag._id": 1,
                    "tag.name": 1,
                    'vote_post': 1,
                    'vote_question': 1,
                    'status': 1,
                    'member._id': 1,
                    'member.user': 1,
                    'member.is_member': 1,
                    'member.role._id': 1,
                    'member.role.name': 1,

                }
            },
            {
                $sort: { 'createdAt': -1 }
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

exports.findAll = async (req, res, next) => {
    try {
        const document = await model.aggregate([
            {
                $lookup: {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'team',
                    as: 'list_post',
                },

            },
            {
                $lookup: {
                    from: 'votes',
                    localField: 'list_post._id',
                    foreignField: 'post',
                    as: 'vote_post',
                    pipeline: [
                        {
                            $group: {
                                _id: '$post',
                                val: { $sum: '$val' },
                            },
                        }
                    ]
                },
            },

            {
                $lookup: {
                    from: 'questions',
                    localField: '_id',
                    foreignField: 'team',
                    as: 'list_question',
                },

            },
            {
                $lookup: {
                    from: 'votes',
                    localField: 'list_question._id',
                    foreignField: 'post',
                    as: 'vote_question',
                    pipeline: [
                        {
                            $group: {
                                _id: '$post',
                                val: { $sum: '$val' },
                            },
                        }
                    ]
                },
            },

            {
                $lookup: {
                    from: 'members',
                    localField: '_id',
                    foreignField: 'team',
                    as: 'member',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'roles',
                                localField: 'role',
                                foreignField: '_id',
                                as: 'role',
                            },
                        }
                    ]
                },
            },

            {
                $lookup: {
                    from: 'tags',
                    localField: 'tag',
                    foreignField: '_id',
                    as: 'tag',
                },
            },
            {
                $lookup: {
                    from: 'status',
                    localField: 'status',
                    foreignField: '_id',
                    as: 'status',
                },
            },
            {
                $project: {
                    "_id": 1,
                    'name': 1,
                    'introduce': 1,
                    'createdAt': 1,
                    'image_cover_url': 1,
                    "tag._id": 1,
                    "tag.name": 1,
                    'vote_post': 1,
                    'vote_question': 1,
                    'status': 1,
                    'member._id': 1,
                    'member.user': 1,
                    'member.is_member': 1,
                    'member.role._id': 1,
                    'member.role.name': 1,

                }
            },
            {
                $sort: { 'createdAt': -1 }
            }
        ])
        return res.json(document);
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findAll' + error })
        )
    }
};


exports.findByTag = async (req, res, next) => {
    const { id } = req.params;

    try {
        const document = await model.aggregate([
            {
                $match: {
                    tag: ObjectId(id),
                }
            },
            {
                $lookup: {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'team',
                    as: 'list_post',
                },

            },
            {
                $lookup: {
                    from: 'votes',
                    localField: 'list_post._id',
                    foreignField: 'post',
                    as: 'vote_post',
                    pipeline: [
                        {
                            $group: {
                                _id: '$post',
                                val: { $sum: '$val' },
                            },
                        }
                    ]
                },
            },

            {
                $lookup: {
                    from: 'questions',
                    localField: '_id',
                    foreignField: 'team',
                    as: 'list_question',
                },

            },
            {
                $lookup: {
                    from: 'votes',
                    localField: 'list_question._id',
                    foreignField: 'post',
                    as: 'vote_question',
                    pipeline: [
                        {
                            $group: {
                                _id: '$post',
                                val: { $sum: '$val' },
                            },
                        }
                    ]
                },
            },

            {
                $lookup: {
                    from: 'members',
                    localField: '_id',
                    foreignField: 'team',
                    as: 'member',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'roles',
                                localField: 'role',
                                foreignField: '_id',
                                as: 'role',
                            },
                        }
                    ]
                },
            },

            {
                $lookup: {
                    from: 'tags',
                    localField: 'tag',
                    foreignField: '_id',
                    as: 'tag',
                },
            },
            {
                $lookup: {
                    from: 'status',
                    localField: 'status',
                    foreignField: '_id',
                    as: 'status',
                },
            },
            {
                $project: {
                    "_id": 1,
                    'name': 1,
                    'introduce': 1,
                    'createdAt': 1,
                    'image_cover_url': 1,
                    "tag._id": 1,
                    "tag.name": 1,
                    'vote_post': 1,
                    'vote_question': 1,
                    'status': 1,
                    'member._id': 1,
                    'member.user': 1,
                    'member.is_member': 1,
                    'member.role._id': 1,
                    'member.role.name': 1,

                }
            },
            {
                $sort: { 'createdAt': -1 }
            }
        ])
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
        const document = await member.find({ user: id, team: { $ne: null }, is_member: true }).populate({
            path: 'team',
            select: 'id name'
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


    try {
        const document = await model.aggregate([
            {
                $match: {
                    _id: ObjectId(id),
                }
            },
            {
                $lookup: {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'team',
                    as: 'list_post',
                },

            },
            {
                $lookup: {
                    from: 'votes',
                    localField: 'list_post._id',
                    foreignField: 'post',
                    as: 'vote_post',
                    pipeline: [
                        {
                            $group: {
                                _id: '$post',
                                val: { $sum: '$val' },
                            },
                        }
                    ]
                },
            },

            {
                $lookup: {
                    from: 'questions',
                    localField: '_id',
                    foreignField: 'team',
                    as: 'list_question',
                },

            },
            {
                $lookup: {
                    from: 'votes',
                    localField: 'list_question._id',
                    foreignField: 'post',
                    as: 'vote_question',
                    pipeline: [
                        {
                            $group: {
                                _id: '$post',
                                val: { $sum: '$val' },
                            },
                        }
                    ]
                },
            },

            {
                $lookup: {
                    from: 'members',
                    localField: '_id',
                    foreignField: 'team',
                    as: 'member',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'roles',
                                localField: 'role',
                                foreignField: '_id',
                                as: 'role',
                            },
                        }
                    ]
                },
            },

            {
                $lookup: {
                    from: 'tags',
                    localField: 'tag',
                    foreignField: '_id',
                    as: 'tag',
                },
            },
            {
                $lookup: {
                    from: 'status',
                    localField: 'status',
                    foreignField: '_id',
                    as: 'status',
                },
            },
            {
                $project: {
                    "_id": 1,
                    'name': 1,
                    'introduce': 1,
                    'createdAt': 1,
                    'image_cover_url': 1,
                    "tag._id": 1,
                    "tag.name": 1,
                    'vote_post': 1,
                    'vote_question': 1,
                    'status': 1,
                    'member._id': 1,
                    'member.user': 1,
                    'member.is_member': 1,
                    'member.role._id': 1,
                    'member.role.name': 1,

                }
            },
        ])
        return res.json(document);
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findAll' + error })
        )
    }
}

exports.findOneEdit = async (req, res, next) => {
    const { id } = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id : null,
    };

    try {
        const document = await model.findOne(condition).populate({
            path: 'tag status'
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



