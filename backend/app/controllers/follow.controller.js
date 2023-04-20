// có 6 chức năng chung là thêm(create), sửa (update), lấy tất cả (findAll), lấy theo id (findOne), xóa theo id (deleteOne), xóa tất cả(deleteAll)
// sẽ có các chức năng khác đi kèm theo nữa tùy nào thực tế
// chú ý chỉnh model, hàm create, select lại

const mongoose = require("mongoose");
const DB = require("../models");
const model = DB.follow;
const ObjectId = mongoose.Types.ObjectId;

exports.create = async (req, res, next) => {
    const modelO = new model({
        user: req.body.user,
        follow: req.body.follow,
        notification: true,
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


exports.findByFollow = async (req, res, next) => {
    const { user, follow } = req.params;


    try {
        const document = await model.findOne({
            user: user,
            follow: follow,
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


exports.findMyFollowUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const document = await model.aggregate([
            {
                $match: {
                    follow: ObjectId(id),
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $match: {
                    "user.0": { $exists: true },
                },
            },
            {
                $lookup: {
                    from: 'follows',
                    localField: 'user._id',
                    foreignField: 'user',
                    as: 'userHaveFollow',
                },
            },

            {
                $lookup: {
                    from: "posts",
                    localField: "user._id",
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
                    localField: "user._id",
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
                    localField: "user._id",
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
                $project: {
                    _id: 1,
                    followsCount: { $size: "$userHaveFollow" },
                    'user._id': 1,
                    'user.name': 1,
                    'user.avatar_url': 1,
                    total_count: {
                        $add: [
                            { $sum: "$vote_post.val" },
                            { $sum: "$vote_question.val" },
                            { $sum: "$vote_answer.val" },
                        ]
                    },
                },
            },
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


exports.findMyFollowPost = async (req, res, next) => {
    const { id } = req.params;
    try {
        const document = await model.aggregate([
            {
                $match: {
                    follow: ObjectId(id),
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "user",
                    foreignField: "_id",
                    as: "post",
                },
            },
            {
                $match: {
                    "post.0": { $exists: true },
                },
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: 'post._id',
                    foreignField: 'post',
                    as: 'comment',
                    pipeline: [
                        {
                            $group: {
                                _id: '$post',
                                count: { $sum: 1 },
                            }

                        }

                    ],

                },
            },
            {
                $lookup: {
                    from: 'votes',
                    localField: 'post._id',
                    foreignField: 'post',
                    as: 'vote',
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
                    from: 'users',
                    localField: 'post.author',
                    foreignField: '_id',
                    as: 'author',
                },
            },
            {
                $lookup: {
                    from: 'tags',
                    localField: 'post.tag',
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
                    "post._id": 1,
                    'post.title': 1,
                    'post.view': 1,
                    'post.image_cover_url': 1,
                    'post.createdAt': 1,
                    "author._id": 1,
                    "author.name": 1,
                    'author.avatar_url': 1,
                    "tag._id": 1,
                    "tag.name": 1,
                    'comment': 1,
                    'vote': 1,
                }
            },
            {
                $sort: { 'post.createdAt': -1 }
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


exports.findMyFollowQuestion = async (req, res, next) => {
    const { id } = req.params;
    try {
        const document = await model.aggregate([
            {
                $match: {
                    follow: ObjectId(id),
                }
            },
            {
                $lookup: {
                    from: "questions",
                    localField: "user",
                    foreignField: "_id",
                    as: "question",
                },
            },

            {
                $match: {
                    "question.0": { $exists: true },
                },
            },

            {
                $lookup: {
                    from: 'comments',
                    localField: 'question._id',
                    foreignField: 'post',
                    as: 'comment',
                    pipeline: [
                        {
                            $group: {
                                _id: '$post',
                                count: { $sum: 1 },
                            }
                        }
                    ]
                },
            },
            {
                $lookup: {
                    from: 'votes',
                    localField: 'question._id',
                    foreignField: 'post',
                    as: 'vote',
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
                    from: 'users',
                    localField: 'question.author',
                    foreignField: '_id',
                    as: 'author',
                },
            },
            {
                $lookup: {
                    from: 'tags',
                    localField: 'question.tag',
                    foreignField: '_id',
                    as: 'tag',
                },
            },
            {
                $lookup: {
                    from: 'status',
                    localField: 'question.status',
                    foreignField: '_id',
                    as: 'status',
                },
            },

            {
                $lookup: {
                    from: 'answers',
                    localField: 'question._id',
                    foreignField: 'question',
                    as: 'answer',
                    pipeline: [
                        {
                            $group: {
                                _id: '$question',
                                count: { $sum: 1 },

                            }
                        }
                    ]
                },
            },

            {
                $lookup: {
                    from: 'answers',
                    localField: 'question._id',
                    foreignField: 'question',
                    as: 'choice',
                    pipeline: [
                        {
                            $match: {
                                choice: true
                            }
                        },
                        {
                            $group: {
                                _id: '$question',
                                count: { $sum: 1 },

                            }
                        }
                    ]
                },
            },
            {
                $project: {
                    "_id": 1,
                    "question._id": 1,
                    'question.title': 1,
                    'question.image_cover_url': 1,
                    'question.createdAt': 1,
                    "author._id": 1,
                    "author.name": 1,
                    'author.avatar_url': 1,
                    "tag._id": 1,
                    "tag.name": 1,
                    'question.view': 1,
                    'comment': 1,
                    'vote': 1,
                    'team': 1,
                    'answer': 1,
                    'choice': 1,
                }
            },
            {
                $sort: { 'question.createdAt': -1 }
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



exports.findMyFollowSeries = async (req, res, next) => {
    const { id } = req.params;
    try {
        const document = await model.aggregate([
            {
                $match: {
                    follow: ObjectId(id),
                }
            },
            {
                $lookup: {
                    from: "series",
                    localField: "user",
                    foreignField: "_id",
                    as: "series",
                },
            },
            {
                $match: {
                    "series.0": { $exists: true },
                },
            },
            {
                $lookup: {
                    from: 'posts',
                    localField: 'series._id',
                    foreignField: 'series',
                    as: 'post',
                    pipeline: [
                        {
                            $group: {
                                _id: "$series",
                                count: { $sum: 1 },
                            }
                        }
                    ]
                },
            },
            {
                $lookup: {
                    from: 'posts',
                    localField: 'series._id',
                    foreignField: 'series',
                    as: 'score',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'votes',
                                localField: '_id',
                                foreignField: 'post',
                                as: 'vote',
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
                            $addFields: {
                                val: { $sum: "$vote.val" }
                            }
                        }
                    ],

                },
            },
            {
                $addFields: {
                    valScore: { $sum: "$score.val" },
                }
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
                $lookup: {
                    from: 'posts',
                    localField: 'series._id',
                    foreignField: 'series',
                    as: 'tag',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'tags',
                                localField: 'tag',
                                foreignField: '_id',
                                as: 'list',
                            },
                        },
                        {
                            $project: {
                                "list._id": 1,
                                'list.name': 1,
                            }
                        },
                    ],
                },
            },
            {
                $addFields: {
                    listtag: "$tag.list"
                }
            },
            {
                $project: {
                    "_id": 1,
                    "series._id": 1,
                    'series.name': 1,
                    'series.introduce': 1,
                    'series.image_cover_url': 1,
                    'series.createdAt': 1,
                    'post.count': 1,
                    'valScore': 1,
                    'listtag': 1,
                }
            },
            {
                $sort: { 'series.createdAt': -1 }
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


exports.findMyFollowTopic = async (req, res, next) => {
    const { id } = req.params;
    try {
        const document = await model.aggregate([
            {
                $match: {
                    follow: ObjectId(id),
                }
            },
            {
                $lookup: {
                    from: "topics",
                    localField: "user",
                    foreignField: "_id",
                    as: "topics",
                },
            },
            {
                $match: {
                    "topics.0": { $exists: true },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'topics.author',
                    foreignField: '_id',
                    as: 'author',
                },
            },
            {
                $lookup: {
                    from: 'questions',
                    localField: 'topics._id',
                    foreignField: 'topic',
                    as: 'question',
                    pipeline: [
                        {
                            $group: {
                                _id: "$topic",
                                count: { $sum: 1 },
                            }
                        }
                    ]
                },
            },
            {
                $lookup: {
                    from: 'questions',
                    localField: 'topics._id',
                    foreignField: 'topic',
                    as: 'score',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'votes',
                                localField: '_id',
                                foreignField: 'post',
                                as: 'vote',
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
                            $addFields: {
                                val: { $sum: "$vote.val" }
                            }
                        }
                    ],

                },
            },
            {
                $addFields: {
                    valScore: { $sum: "$score.val" },
                }
            },
            {
                $lookup: {
                    from: 'status',
                    localField: 'topics.status',
                    foreignField: '_id',
                    as: 'status',
                },
            },

            {
                $lookup: {
                    from: 'questions',
                    localField: 'topics._id',
                    foreignField: 'topic',
                    as: 'tag',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'tags',
                                localField: 'tag',
                                foreignField: '_id',
                                as: 'list',
                            },
                        },
                        {
                            $project: {
                                "list._id": 1,
                                'list.name': 1,
                            }
                        },
                    ],
                },
            },
            {
                $addFields: {
                    listtag: "$tag.list"
                }
            },
            {
                $project: {
                    "_id": 1,
                    "topics._id": 1,
                    'topics.name': 1,
                    'topics.introduce': 1,
                    'topics.image_cover_url': 1,
                    'topics.createdAt': 1,
                    "author._id": 1,
                    "author.name": 1,
                    'author.avatar_url': 1,
                    'question.count': 1,
                    'valScore': 1,
                    'listtag': 1,
                }
            },
            {
                $sort: { 'topics.createdAt': -1 }
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


exports.findMyFollowTeam = async (req, res, next) => {
    const { id } = req.params;
    try {
        const document = await model.aggregate([
            {
                $match: {
                    follow: ObjectId(id),
                }
            },
            {
                $lookup: {
                    from: "teams",
                    localField: "user",
                    foreignField: "_id",
                    as: "teams",
                },
            },
            {
                $match: {
                    "teams.0": { $exists: true },
                },
            },
            {
                $lookup: {
                    from: 'posts',
                    localField: 'teams._id',
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
                    localField: 'teams._id',
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
                    localField: 'teams._id',
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
                    localField: 'teams.tag',
                    foreignField: '_id',
                    as: 'tag',
                },
            },
            {
                $lookup: {
                    from: 'status',
                    localField: 'teams.status',
                    foreignField: '_id',
                    as: 'status',
                },
            },
            {
                $project: {
                    "_id": 1,
                    "teams._id": 1,
                    'teams.name': 1,
                    'teams.introduce': 1,
                    'teams.createdAt': 1,
                    'teams.image_cover_url': 1,
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


exports.findMyFollowCourse = async (req, res, next) => {
    const { id } = req.params;
    try {
        const document = await model.aggregate([
            {
                $match: {
                    follow: ObjectId(id),
                }
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "user",
                    foreignField: "_id",
                    as: "course",
                },
            },
            {
                $match: {
                    "course.0": { $exists: true },
                },
            },

            {
                $project: {
                    _id: 1,
                    'course._id': 1,
                    'course.name': 1,
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
            res.status(500).json({ Message: 'không  thể  lấy findMyFollowCourse' + error })
        )
    }
}



exports.findMyFollowTag = async (req, res, next) => {
    const { id } = req.params;
    try {
        const document = await model.aggregate([
            {
                $match: {
                    follow: ObjectId(id),
                }
            },
            {
                $lookup: {
                    from: "tags",
                    localField: "user",
                    foreignField: "_id",
                    as: "tags",
                },
            },
            {
                $match: {
                    "tags.0": { $exists: true },
                },
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "tags._id",
                    foreignField: "tag",
                    as: "posts"
                }
            },
            {
                $lookup: {
                    from: "questions",
                    localField: "tags._id",
                    foreignField: "tag",
                    as: "questions"
                }
            },
            {
                $lookup: {
                    from: "teams",
                    localField: "tags._id",
                    foreignField: "tag",
                    as: "teams"
                }
            },
            {
                $project: {
                    _id: 1,
                    'tags._id': 1,
                    'tags.name': 1,
                    'tags.introduce': 1,
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
        const document = await model.find({
            user: id,
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



