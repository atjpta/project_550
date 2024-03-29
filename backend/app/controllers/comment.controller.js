const mongoose = require("mongoose");
const DB = require("../models");
const model = DB.comment;
const ObjectId = mongoose.Types.ObjectId;

exports.getByGuest = async (req, res, next) => {
    let { id, type, filter } = req.params;
    if (filter == 'vote') {
        filter = 'vote.val'
    }
    try {
        let document;
        switch (type) {
            case 'post':
                document = await model.aggregate([
                    // lọc ra các phần muốn lấy
                    {
                        $match: {
                            post: ObjectId(id),
                            cmt_parent: null,
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'author',
                            foreignField: '_id',
                            as: 'author',
                        },
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'tag_name',
                            foreignField: '_id',
                            as: 'tag_name',
                        },
                    },
                    {
                        $lookup: {
                            from: 'comments',
                            localField: '_id',
                            foreignField: 'cmt_parent',
                            as: 'child',
                            pipeline: [
                                {
                                    $group: {
                                        _id: '$cmt_parent',
                                        count: { $sum: 1 },
                                    }
                                }
                            ]
                        },
                    },
                    {
                        $lookup: {
                            from: 'votes',
                            localField: '_id',
                            foreignField: 'comment',
                            as: 'vote',
                            pipeline: [
                                {
                                    $group: {
                                        _id: '$comment',
                                        val: { $sum: '$val' },

                                    },

                                }
                            ]
                        },
                    },
                    {
                        $project: {
                            "_id": 1,
                            "post": 1,
                            'content': 1,
                            'child': 1,
                            'createdAt': 1,
                            "author._id": 1,
                            "author.name": 1,
                            'author.avatar_url': 1,
                            "tag_name._id": 1,
                            "tag_name.name": 1,
                            'tag_name.avatar_url': 1,
                            'vote_user': 1,
                            'vote': 1,
                        }
                    },
                    {
                        $sort: { [filter]: -1, 'createdAt': -1 }
                    }
                ])
                break;
            case 'question':
                document = await model.aggregate([
                    // lọc ra các phần muốn lấy
                    {
                        $match: {
                            question: ObjectId(id)
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'author',
                            foreignField: '_id',
                            as: 'author',
                        },
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'tag_name',
                            foreignField: '_id',
                            as: 'tag_name',
                        },
                    },
                    {
                        $lookup: {
                            from: 'comments',
                            localField: '_id',
                            foreignField: 'cmt_parent',
                            as: 'child',
                            pipeline: [
                                {
                                    $group: {
                                        _id: '$cmt_parent',
                                        count: { $sum: 1 },
                                    }
                                }
                            ]
                        },
                    },
                    {
                        $lookup: {
                            from: 'votes',
                            localField: '_id',
                            foreignField: 'comment',
                            as: 'vote',
                            pipeline: [
                                {
                                    $group: {
                                        _id: '$comment',
                                        val: { $sum: '$val' },

                                    },

                                }
                            ]
                        },
                    },
                    {
                        $lookup: {
                            from: 'votes',
                            localField: '_id',
                            foreignField: 'post',
                            as: 'vote_user',
                            pipeline: [
                                {
                                    $match: {
                                        question: ObjectId(user)
                                    }
                                }
                            ]
                        },
                    },
                    {
                        $project: {
                            "_id": 1,
                            "post": 1,
                            'content': 1,
                            'child': 1,
                            'createdAt': 1,
                            "author._id": 1,
                            "author.name": 1,
                            'author.avatar_url': 1,
                            "tag_name._id": 1,
                            "tag_name.name": 1,
                            'tag_name.avatar_url': 1,
                            'vote_user': 1,
                            'vote': 1,
                        }
                    },
                    {
                        $sort: { 'createdAt': -1 }
                    }
                ])
                break;
            case 'answer':
                document = await model.aggregate([
                    // lọc ra các phần muốn lấy
                    {
                        $match: {
                            answer: ObjectId(id)
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'author',
                            foreignField: '_id',
                            as: 'author',
                        },
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'tag_name',
                            foreignField: '_id',
                            as: 'tag_name',
                        },
                    },
                    {
                        $lookup: {
                            from: 'comments',
                            localField: '_id',
                            foreignField: 'cmt_parent',
                            as: 'child',
                            pipeline: [
                                {
                                    $group: {
                                        _id: '$cmt_parent',
                                        count: { $sum: 1 },
                                    }
                                }

                            ]
                        },
                    },
                    {
                        $lookup: {
                            from: 'votes',
                            localField: '_id',
                            foreignField: 'comment',
                            as: 'vote',
                            pipeline: [
                                {
                                    $group: {
                                        _id: '$comment',
                                        val: { $sum: '$val' },

                                    },

                                }
                            ]
                        },
                    },
                    {
                        $project: {
                            "_id": 1,
                            "post": 1,
                            'content': 1,
                            'child': 1,
                            'createdAt': 1,
                            "author._id": 1,
                            "author.name": 1,
                            'author.avatar_url': 1,
                            "tag_name._id": 1,
                            "tag_name.name": 1,
                            'tag_name.avatar_url': 1,
                            'vote_user': 1,
                            'vote': 1,
                        }
                    },
                    {
                        $sort: { 'createdAt': -1 }
                    }
                ])
                break;
            case 'test':
                document = await model.find({ cmt_parent: id }).populate({
                    path: 'author tag_name',
                    select: 'id name avatar_url'
                })
                break;
            case 'child':
                document = await model.aggregate([
                    // lọc ra các phần muốn lấy
                    {
                        $match: {
                            cmt_parent: ObjectId(id)
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'author',
                            foreignField: '_id',
                            as: 'author',
                        },
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'tag_name',
                            foreignField: '_id',
                            as: 'tag_name',
                        },
                    },
                    {
                        $lookup: {
                            from: 'comments',
                            localField: '_id',
                            foreignField: 'cmt_parent',
                            as: 'child',
                            pipeline: [
                                {
                                    $group: {
                                        _id: '$cmt_parent',
                                        count: { $sum: 1 },
                                    }
                                }

                            ]
                        },
                    },
                    {
                        $lookup: {
                            from: 'votes',
                            localField: '_id',
                            foreignField: 'comment',
                            as: 'vote',
                            pipeline: [
                                {
                                    $group: {
                                        _id: '$comment',
                                        val: { $sum: '$val' },

                                    },

                                }
                            ]
                        },
                    },
                    {
                        $project: {
                            "_id": 1,
                            "post": 1,
                            'content': 1,
                            'child': 1,
                            'createdAt': 1,
                            "author._id": 1,
                            "author.name": 1,
                            'author.avatar_url': 1,
                            "tag_name._id": 1,
                            "tag_name.name": 1,
                            'tag_name.avatar_url': 1,
                            'vote_user': 1,
                            'vote': 1,
                        }
                    },
                    {
                        $sort: { 'createdAt': -1 }
                    }
                ])
                break;
        }
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


exports.getBy = async (req, res, next) => {
    let { id, type, user, filter } = req.params;
    if (filter == 'vote') {
        filter = 'vote.val'
    }
    try {
        let document;
        switch (type) {
            case 'post':
                document = await model.aggregate([
                    // lọc ra các phần muốn lấy
                    {
                        $match: {
                            post: ObjectId(id),
                            cmt_parent: null,
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'author',
                            foreignField: '_id',
                            as: 'author',
                        },
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'tag_name',
                            foreignField: '_id',
                            as: 'tag_name',
                        },
                    },
                    {
                        $lookup: {
                            from: 'comments',
                            localField: '_id',
                            foreignField: 'cmt_parent',
                            as: 'child',
                            pipeline: [
                                {
                                    $group: {
                                        _id: '$cmt_parent',
                                        count: { $sum: 1 },
                                    }
                                }
                            ]
                        },
                    },
                    {
                        $lookup: {
                            from: 'votes',
                            localField: '_id',
                            foreignField: 'comment',
                            as: 'vote',
                            pipeline: [
                                {
                                    $group: {
                                        _id: '$comment',
                                        val: { $sum: '$val' },

                                    },

                                }
                            ]
                        },
                    },
                    {
                        $lookup: {
                            from: 'votes',
                            localField: '_id',
                            foreignField: 'comment',
                            as: 'vote_user',
                            pipeline: [
                                {
                                    $match: {
                                        author: ObjectId(user)
                                    }
                                }
                            ]
                        },
                    },
                    {
                        $project: {
                            "_id": 1,
                            "post": 1,
                            'content': 1,
                            'child': 1,
                            'createdAt': 1,
                            "author._id": 1,
                            "author.name": 1,
                            'author.avatar_url': 1,
                            "tag_name._id": 1,
                            "tag_name.name": 1,
                            'tag_name.avatar_url': 1,
                            'vote_user': 1,
                            'vote': 1,
                        }
                    },
                    {
                        $sort: { [filter]: -1, 'createdAt': -1 }
                    }
                ])
                break;
            case 'question':
                document = await model.aggregate([
                    // lọc ra các phần muốn lấy
                    {
                        $match: {
                            question: ObjectId(id)
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'author',
                            foreignField: '_id',
                            as: 'author',
                        },
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'tag_name',
                            foreignField: '_id',
                            as: 'tag_name',
                        },
                    },
                    {
                        $lookup: {
                            from: 'comments',
                            localField: '_id',
                            foreignField: 'cmt_parent',
                            as: 'child',
                            pipeline: [
                                {
                                    $group: {
                                        _id: '$cmt_parent',
                                        count: { $sum: 1 },
                                    }
                                }
                            ]
                        },
                    },
                    {
                        $lookup: {
                            from: 'votes',
                            localField: '_id',
                            foreignField: 'comment',
                            as: 'vote',
                            pipeline: [
                                {
                                    $group: {
                                        _id: '$comment',
                                        val: { $sum: '$val' },

                                    },

                                }
                            ]
                        },
                    },
                    {
                        $lookup: {
                            from: 'votes',
                            localField: '_id',
                            foreignField: 'comment',
                            as: 'vote_user',
                            pipeline: [
                                {
                                    $match: {
                                        author: ObjectId(user)
                                    }
                                }
                            ]
                        },
                    },
                    {
                        $lookup: {
                            from: 'votes',
                            localField: '_id',
                            foreignField: 'post',
                            as: 'vote_user',
                            pipeline: [
                                {
                                    $match: {
                                        question: ObjectId(user)
                                    }
                                }
                            ]
                        },
                    },
                    {
                        $project: {
                            "_id": 1,
                            "post": 1,
                            'content': 1,
                            'child': 1,
                            'createdAt': 1,
                            "author._id": 1,
                            "author.name": 1,
                            'author.avatar_url': 1,
                            "tag_name._id": 1,
                            "tag_name.name": 1,
                            'tag_name.avatar_url': 1,
                            'vote_user': 1,
                            'vote': 1,
                        }
                    },
                    {
                        $sort: { 'createdAt': -1 }
                    }
                ])
                break;
            case 'answer':
                document = await model.aggregate([
                    // lọc ra các phần muốn lấy
                    {
                        $match: {
                            answer: ObjectId(id)
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'author',
                            foreignField: '_id',
                            as: 'author',
                        },
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'tag_name',
                            foreignField: '_id',
                            as: 'tag_name',
                        },
                    },
                    {
                        $lookup: {
                            from: 'comments',
                            localField: '_id',
                            foreignField: 'cmt_parent',
                            as: 'child',
                            pipeline: [
                                {
                                    $group: {
                                        _id: '$cmt_parent',
                                        count: { $sum: 1 },
                                    }
                                }

                            ]
                        },
                    },
                    {
                        $lookup: {
                            from: 'votes',
                            localField: '_id',
                            foreignField: 'comment',
                            as: 'vote',
                            pipeline: [
                                {
                                    $group: {
                                        _id: '$comment',
                                        val: { $sum: '$val' },

                                    },

                                }
                            ]
                        },
                    },
                    {
                        $lookup: {
                            from: 'votes',
                            localField: '_id',
                            foreignField: 'post',
                            as: 'vote_user',
                            pipeline: [
                                {
                                    $match: {
                                        answer: ObjectId(user)
                                    }
                                }
                            ]
                        },
                    },
                    {
                        $lookup: {
                            from: 'votes',
                            localField: '_id',
                            foreignField: 'comment',
                            as: 'vote_user',
                            pipeline: [
                                {
                                    $match: {
                                        author: ObjectId(user)
                                    }
                                }
                            ]
                        },
                    },
                    {
                        $project: {
                            "_id": 1,
                            "post": 1,
                            'content': 1,
                            'child': 1,
                            'createdAt': 1,
                            "author._id": 1,
                            "author.name": 1,
                            'author.avatar_url': 1,
                            "tag_name._id": 1,
                            "tag_name.name": 1,
                            'tag_name.avatar_url': 1,
                            'vote_user': 1,
                            'vote': 1,
                        }
                    },
                    {
                        $sort: { 'createdAt': -1 }
                    }
                ])
                break;
            case 'test':
                document = await model.find({ cmt_parent: id }).populate({
                    path: 'author tag_name',
                    select: 'id name avatar_url'
                })
                break;
            case 'child':
                document = await model.aggregate([
                    // lọc ra các phần muốn lấy
                    {
                        $match: {
                            cmt_parent: ObjectId(id)
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'author',
                            foreignField: '_id',
                            as: 'author',
                        },
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'tag_name',
                            foreignField: '_id',
                            as: 'tag_name',
                        },
                    },
                    {
                        $lookup: {
                            from: 'comments',
                            localField: '_id',
                            foreignField: 'cmt_parent',
                            as: 'child',
                            pipeline: [
                                {
                                    $group: {
                                        _id: '$cmt_parent',
                                        count: { $sum: 1 },
                                    }
                                }

                            ]
                        },
                    },
                    {
                        $lookup: {
                            from: 'votes',
                            localField: '_id',
                            foreignField: 'comment',
                            as: 'vote',
                            pipeline: [
                                {
                                    $group: {
                                        _id: '$comment',
                                        val: { $sum: '$val' },

                                    },

                                }
                            ]
                        },
                    },
                    {
                        $lookup: {
                            from: 'votes',
                            localField: '_id',
                            foreignField: 'comment',
                            as: 'vote_user',
                            pipeline: [
                                {
                                    $match: {
                                        author: ObjectId(user)
                                    }
                                }
                            ]
                        },
                    },
                    {
                        $project: {
                            "_id": 1,
                            "post": 1,
                            'content': 1,
                            'child': 1,
                            'createdAt': 1,
                            "author._id": 1,
                            "author.name": 1,
                            'author.avatar_url': 1,
                            "tag_name._id": 1,
                            "tag_name.name": 1,
                            'tag_name.avatar_url': 1,
                            'vote_user': 1,
                            'vote': 1,
                        }
                    },
                    {
                        $sort: { 'createdAt': -1 }
                    }
                ])
                break;
        }
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


exports.create = async (req, res, next) => {
    const modelO = new model({
        post: req.body.post,
        question: req.body.question,
        answer: req.body.answer,
        content: req.body.content,
        author: req.body.author,
        cmt_parent: req.body.cmt_parent,
        tag_name: req.body.tag_name,
    })
    try {
        const document = modelO.save();
        return res.send({ Message: 'tạo thành công model' });
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể create model' + error })
        )
    }
}

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



