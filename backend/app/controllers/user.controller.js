const mongoose = require("mongoose");
const DB = require("../models");
const model = DB.user;
const ObjectId = mongoose.Types.ObjectId;


exports.findAll = async (req, res, next) => {
    try {
        const document = await model.find({ _id: { $ne: req.params.id } }).select([
            "name",
            "id",
            "avatar_url",
        ]);
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
        const document = await model.findOne(condition).populate('role').select([
            "name",
            "id",
            "avatar_url",
            'role',
            'introduce'
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

exports.findOverView = async (req, res, next) => {
    const { id } = req.params;

    try {
        const document = await model.aggregate([
            // lọc ra các phần muốn lấy
            {
                $match: {
                    _id: ObjectId(id),
                }
            },
            {
                $lookup: {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'author',
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
                    foreignField: 'author',
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
                    from: 'answers',
                    localField: '_id',
                    foreignField: 'author',
                    as: 'list_answer',
                    
                },

            },
            
            {
                $lookup: {
                    from: 'votes',
                    localField: 'list_answer._id',
                    foreignField: 'answer',
                    as: 'vote_answer',
                    pipeline: [
                        {
                            $group: {
                                _id: '$answer',
                                val: { $sum: '$val' },
                            },
                        }
                    ]
                },
            },
            {
                $lookup: {
                    from: 'series',
                    localField: '_id',
                    foreignField: 'author',
                    as: 'series',
                },
            },
            
            {
                $lookup: {
                    from: 'topics',
                    localField: '_id',
                    foreignField: 'author',
                    as: 'topic',
                },
            },
            {
                $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "user",
                    as: "follows",
                },
            },
            // cái này phải để dưới thì cái $ kia mới có
            {
                $addFields: {
                    seriesCount: { $size: "$series" },
                    topicCount: { $size: "$topic" },
                    postCount: { $size: "$list_post" },
                    questionCount: { $size: "$list_question" },
                    answerCount: { $size: "$list_answer" },
                }
            },
            {
                $project: {
                    "_id": 1,
                    "name": 1,
                    "introduce": 1,
                    "avatar_url": 1,
                    'createdAt': 1,
                    'vote_post': 1,
                    'vote_question': 1,
                    'seriesCount': 1,
                    'topicCount': 1,
                    'team': 1,
                    'follow': 1,
                    'vote_answer': 1,
                    'postCount': 1,
                    'questionCount': 1,
                    'answerCount': 1,
                    followsCount: { $size: "$follows" },

                }
            },
            {
                $sort: { 'createdAt': -1 }
            }
        ])
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


exports.findAllOverViewPage = async (req, res, next) => {
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
                    foreignField: "author",
                    as: "list_post",
                },
            },
            {
                $lookup: {
                    from: "votes",
                    let: { postIds: "$list_post._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ["$post", "$$postIds"] },
                            },
                        },
                        {
                            $group: {
                                _id: "$post",
                                val: { $sum: "$val" },
                            },
                        },
                    ],
                    as: "vote_post",
                },
            },
            {
                $lookup: {
                    from: "questions",
                    localField: "_id",
                    foreignField: "author",
                    as: "list_question",
                },
            },
            {
                $lookup: {
                    from: "votes",
                    let: { questionIds: "$list_question._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ["$post", "$$questionIds"] },
                            },
                        },
                        {
                            $group: {
                                _id: "$post",
                                val: { $sum: "$val" },
                            },
                        },
                    ],
                    as: "vote_question",
                },
            },
            {
                $lookup: {
                    from: "answers",
                    localField: "_id",
                    foreignField: "author",
                    as: "list_answer",
                },
            },
            {
                $lookup: {
                    from: "votes",
                    let: { answerIds: "$list_answer._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ["$answer", "$$answerIds"] },
                            },
                        },
                        {
                            $group: {
                                _id: "$answer",
                                val: { $sum: "$val" },
                            },
                        },
                    ],
                    as: "vote_answer",
                },
            },
            {
                $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "user",
                    as: "follows",
                },
            },
            {
                $project: {
                    _id: 1,
                    avatar_url: 1,
                    name: 1,
                    followsCount: { $size: "$follows" },
                    total_count: {
                        $add: [
                            { $sum: "$vote_post.val" },
                            { $sum: "$vote_question.val" },
                            { $sum: "$vote_answer.val" },
                        ]
                    }
                },
            },
            {
                $skip: skip
            },
            {
                $limit: size
            },

        ]);
        return res.json(document);
    } catch (error) {
        return next(
            res.status(500).json({ Message: "không thể lấy findAll" + error })
        );
    }
};

exports.findAllOverView = async (req, res, next) => {
    try {
        const document = await model.aggregate([
            {
                $lookup: {
                    from: "posts",
                    localField: "_id",
                    foreignField: "author",
                    as: "list_post",
                },
            },
            {
                $lookup: {
                    from: "votes",
                    let: { postIds: "$list_post._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ["$post", "$$postIds"] },
                            },
                        },
                        {
                            $group: {
                                _id: "$post",
                                val: { $sum: "$val" },
                            },
                        },
                    ],
                    as: "vote_post",
                },
            },
            {
                $lookup: {
                    from: "questions",
                    localField: "_id",
                    foreignField: "author",
                    as: "list_question",
                },
            },
            {
                $lookup: {
                    from: "votes",
                    let: { questionIds: "$list_question._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ["$post", "$$questionIds"] },
                            },
                        },
                        {
                            $group: {
                                _id: "$post",
                                val: { $sum: "$val" },
                            },
                        },
                    ],
                    as: "vote_question",
                },
            },
            {
                $lookup: {
                    from: "answers",
                    localField: "_id",
                    foreignField: "author",
                    as: "list_answer",
                },
            },
            {
                $lookup: {
                    from: "votes",
                    let: { answerIds: "$list_answer._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ["$answer", "$$answerIds"] },
                            },
                        },
                        {
                            $group: {
                                _id: "$answer",
                                val: { $sum: "$val" },
                            },
                        },
                    ],
                    as: "vote_answer",
                },
            },
            {
                $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "user",
                    as: "follows",
                },
            },
            {
                $project: {
                    _id: 1,
                    avatar_url: 1,
                    name: 1,
                    followsCount: { $size: "$follows" },
                    total_count: {
                        $add: [
                            { $sum: "$vote_post.val" },
                            { $sum: "$vote_question.val" },
                            { $sum: "$vote_answer.val" },
                        ]
                    }
                },
            },
           
        ]);
        return res.json(document);
    } catch (error) {
        return next(
            res.status(500).json({ Message: "không thể lấy findAll" + error })
        );
    }
};


exports.findAllOverView = async (req, res, next) => {
    try {
        const document = await model.aggregate([
            {
                $lookup: {
                    from: "posts",
                    localField: "_id",
                    foreignField: "author",
                    as: "list_post",
                },
            },
            {
                $lookup: {
                    from: "votes",
                    let: { postIds: "$list_post._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ["$post", "$$postIds"] },
                            },
                        },
                        {
                            $group: {
                                _id: "$post",
                                val: { $sum: "$val" },
                            },
                        },
                    ],
                    as: "vote_post",
                },
            },
            {
                $lookup: {
                    from: "questions",
                    localField: "_id",
                    foreignField: "author",
                    as: "list_question",
                },
            },
            {
                $lookup: {
                    from: "votes",
                    let: { questionIds: "$list_question._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ["$post", "$$questionIds"] },
                            },
                        },
                        {
                            $group: {
                                _id: "$post",
                                val: { $sum: "$val" },
                            },
                        },
                    ],
                    as: "vote_question",
                },
            },
            {
                $lookup: {
                    from: "answers",
                    localField: "_id",
                    foreignField: "author",
                    as: "list_answer",
                },
            },
            {
                $lookup: {
                    from: "votes",
                    let: { answerIds: "$list_answer._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ["$answer", "$$answerIds"] },
                            },
                        },
                        {
                            $group: {
                                _id: "$answer",
                                val: { $sum: "$val" },
                            },
                        },
                    ],
                    as: "vote_answer",
                },
            },
            {
                $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "user",
                    as: "follows",
                },
            },
            {
                $project: {
                    _id: 1,
                    avatar_url: 1,
                    name: 1,
                    followsCount: { $size: "$follows" },
                    total_count: {
                        $add: [
                            { $sum: "$vote_post.val" },
                            { $sum: "$vote_question.val" },
                            { $sum: "$vote_answer.val" },
                        ]
                    }
                },
            },

        ]);
        return res.json(document);
    } catch (error) {
        return next(
            res.status(500).json({ Message: "không thể lấy findAll" + error })
        );
    }
};


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



