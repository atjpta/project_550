const mongoose = require("mongoose");
const DB = require("../models");
const model = DB.quenstion;
const ObjectId = mongoose.Types.ObjectId;



exports.findByCourse = async (req, res, next) => {
    const { id } = req.params;
    try {
        const document = await model.aggregate([
            {
                $match: {
                    course: ObjectId(id),
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
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
                    from: 'answers',
                    localField: '_id',
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
                    localField: '_id',
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
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
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
                    from: 'topics',
                    localField: 'topic',
                    foreignField: '_id',
                    as: 'topics',

                },
            },
            {
                $lookup: {
                    from: 'teams',
                    localField: 'topics.team',
                    foreignField: '_id',
                    as: 'topicsTeam',

                },
            },

            {
                $lookup: {
                    from: 'teams',
                    localField: 'team',
                    foreignField: '_id',
                    as: 'team',

                },
            },


            {
                $project: {
                    "_id": 1,
                    'title': 1,
                    'image_cover_url': 1,
                    'createdAt': 1,
                    "author._id": 1,
                    "author.name": 1,
                    'author.avatar_url': 1,
                    "tag._id": 1,
                    "tag.name": 1,
                    'view': 1,
                    'comment': 1,
                    'vote': 1,
                    'answer': 1,
                    'choice': 1,
                }
            },

            {
                $sort: { createdAt: -1 }
            },

        ])
        return res.json(document);
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findAll a ' + error })
        )
    }
};


exports.findByAdmin = async (req, res, next) => {
    let slModelReport = 0
    try {
        const document = await model.aggregate([
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
                    from: 'reports',
                    localField: '_id',
                    foreignField: 'model',
                    as: 'reports',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'author',
                                foreignField: '_id',
                                as: 'author',
                            },

                        },
                        {
                            $project: {
                                "_id": 1,
                                "content": 1,
                                "author._id": 1,
                                "author.name": 1,
                                'author.avatar_url': 1,
                            }
                        }
                    ]
                },
            },

            {
                $addFields: {
                    slReport: {
                        $size: '$reports'
                    }
                }
            },
            {
                $project: {
                    "_id": 1,
                    'title': 1,
                    'createdAt': 1,
                    'slReport': 1,
                    'reports': 1,
                    "author._id": 1,
                    "author.name": 1,
                    'author.avatar_url': 1,
                }
            },
            {
                $sort: { 'slReport': -1, 'createdAt': -1 }
            }
        ])
        return res.send(document)
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findBySeries ' + error })
        )
    }
};

exports.findPerFilter = async (req, res, next) => {
    let { filter } = req.params
    if (filter == 'vote') {
        filter = 'vote.val'
    }
    const size = parseInt(req.params.size)
    let skip = size * parseInt(req.params.page - 1)

    if (skip < 0) {
        skip = 0
    }
    try {
        const document = await model.aggregate([
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
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
                    from: 'answers',
                    localField: '_id',
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
                    localField: '_id',
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
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
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
                    from: 'topics',
                    localField: 'topic',
                    foreignField: '_id',
                    as: 'topics',

                },
            },
            {
                $lookup: {
                    from: 'teams',
                    localField: 'topics.team',
                    foreignField: '_id',
                    as: 'topicsTeam',

                },
            },

            {
                $lookup: {
                    from: 'teams',
                    localField: 'team',
                    foreignField: '_id',
                    as: 'team',

                },
            },

            {
                $lookup: {
                    from: 'status',
                    localField: 'status',
                    foreignField: '_id',
                    as: 'statusQuestion',
                },
            },

            {
                $lookup: {
                    from: 'status',
                    localField: 'team.status',
                    foreignField: '_id',
                    as: 'statusTeam',
                },
            },
            {
                $lookup: {
                    from: 'status',
                    localField: 'topicsTeam.status',
                    foreignField: '_id',
                    as: 'statusTopicsTeam',
                },
            },
            {
                $project: {
                    "_id": 1,
                    'title': 1,
                    'image_cover_url': 1,
                    'createdAt': 1,
                    "author._id": 1,
                    "author.name": 1,
                    'author.avatar_url': 1,
                    "tag._id": 1,
                    "tag.name": 1,
                    'view': 1,
                    'comment': 1,
                    'vote': 1,
                    'answer': 1,
                    'choice': 1,
                    isPublic: {
                        $cond: {
                            if: {
                                $or: [
                                    { $eq: ['$statusQuestion.name', ['private']] },
                                    {
                                        $and: [
                                            { $eq: ['$statusTeam.name', ['private']] },
                                            { $eq: ['$topics', []] }
                                        ]
                                    },
                                    { $eq: ['$statusTopicsTeam.name', ['private']] },
                                ]
                            },
                            then: false,
                            else: true
                        }
                    },
                    isUnreply: {
                        $cond: {
                            if: {
                                $and: [
                                    { $eq: [filter, 'unreply'] },
                                    { $gt: ['$choice.count', [0]] },
                                ]
                            },
                            then: 0,
                            else: 1
                        }
                    }
                }
            },
            {
                $match: {
                    isPublic: true,
                }
            },
            {
                $sort: { isUnreply: -1, [filter]: -1, createdAt: -1 }
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
            res.status(500).json({ Message: 'không  thể  lấy findAll a ' + error })
        )
    }
};



exports.findByOther = async (req, res, next) => {
    const { id } = req.params;
    try {
        const document = await model.aggregate([
            // lọc ra các phần muốn lấy
            {
                $match: {
                    author: ObjectId(id),
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
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
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
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
                    from: 'answers',
                    localField: '_id',
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
                    localField: '_id',
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
                $lookup: {
                    from: 'topics',
                    localField: 'topic',
                    foreignField: '_id',
                    as: 'topics',

                },
            },
            {
                $lookup: {
                    from: 'teams',
                    localField: 'topics.team',
                    foreignField: '_id',
                    as: 'topicsTeam',

                },
            },

            {
                $lookup: {
                    from: 'teams',
                    localField: 'team',
                    foreignField: '_id',
                    as: 'team',

                },
            },

            {
                $lookup: {
                    from: 'status',
                    localField: 'status',
                    foreignField: '_id',
                    as: 'statusQuestion',
                },
            },

            {
                $lookup: {
                    from: 'status',
                    localField: 'team.status',
                    foreignField: '_id',
                    as: 'statusTeam',
                },
            },
            {
                $lookup: {
                    from: 'status',
                    localField: 'topicsTeam.status',
                    foreignField: '_id',
                    as: 'statusTopicsTeam',
                },
            },
            {
                $project: {
                    "_id": 1,
                    'title': 1,
                    'image_cover_url': 1,
                    'createdAt': 1,
                    "author._id": 1,
                    "author.name": 1,
                    'author.avatar_url': 1,
                    "tag._id": 1,
                    "tag.name": 1,
                    'view': 1,
                    'comment': 1,
                    'vote': 1,
                    'team': 1,
                    'answer': 1,
                    'choice': 1,
                    isPublic: {
                        $cond: {
                            if: {
                                $or: [
                                    { $eq: ['$statusQuestion.name', ['private']] },
                                    {
                                        $and: [
                                            { $eq: ['$statusTeam.name', ['private']] },
                                            { $eq: ['$topics', []] }
                                        ]
                                    },
                                    { $eq: ['$statusTopicsTeam.name', ['private']] },
                                ]
                            },
                            then: false,
                            else: true
                        }
                    }
                }
            },
            {
                $match: {
                    isPublic: true
                }
            },
            {
                $sort: { 'createdAt': -1 }
            }
        ])
        return res.send(document)
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findBytopic ' + error })
        )
    }
};


exports.updateTopic = async (req, res, next) => {
    const { id } = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id : null,
    };
    try {
        if (Object.keys(req.body).length === 0) {
            // xóa topic
            const document = await model.findByIdAndUpdate(condition, { $unset: { topic: 1, team: 1 } })

            if (!document) {
                return next(res.status(404).json({ Message: "không thể tìm thấy model" }));
            }
            return res.send({ message: "đã xóa khỏi topic thành công", body: req.body });
        }
        else {
            if (!req.body.team) {
                await model.findByIdAndUpdate(condition, { $unset: { team: 1 } });
                delete req.body.team;
            }
            // add topic
            const document = await model.findByIdAndUpdate(condition, req.body, {
                new: true
            });
            if (!document) {
                return next(res.status(404).json({ Message: "không thể tìm thấy model" }));
            }
            return res.send({ message: "đã theo vào topic  thành công", body: req.body });
        }

    }
    catch (error) {
        return next(
            res.status(500).json({ Message: ` không thể update model với id = ${req.params.id} ` })
        )
    }
}

exports.findByNoTopic = async (req, res, next) => {
    const { id } = req.params;
    try {
        const document = await model.aggregate([
            // lọc ra các phần muốn lấy
            {
                $match: {
                    topic: null,
                    author: ObjectId(id),
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
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
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
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
                $lookup: {
                    from: 'answers',
                    localField: '_id',
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
                    localField: '_id',
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
                    'title': 1,
                    'image_cover_url': 1,
                    'createdAt': 1,
                    "author._id": 1,
                    "author.name": 1,
                    'author.avatar_url': 1,
                    "tag._id": 1,
                    "tag.name": 1,
                    'view': 1,
                    'comment': 1,
                    'vote': 1,
                    'answer': 1,
                    'choice': 1,
                }
            },
            {
                $sort: { 'createdAt': -1 }
            }
        ])
        return res.send(document)
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findBytopic ' + error })
        )
    }
};

exports.findByTopic = async (req, res, next) => {
    const { id } = req.params;
    try {
        const document = await model.aggregate([
            // lọc ra các phần muốn lấy
            {
                $match: {
                    topic: ObjectId(id),
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
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
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
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
                $match: {
                    'status.name': 'public',
                }
            },

            {
                $lookup: {
                    from: 'answers',
                    localField: '_id',
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
                    localField: '_id',
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
                    'title': 1,
                    'image_cover_url': 1,
                    'createdAt': 1,
                    "author._id": 1,
                    "author.name": 1,
                    'author.avatar_url': 1,
                    "tag._id": 1,
                    "tag.name": 1,
                    'view': 1,
                    'comment': 1,
                    'vote': 1,
                    'topic': 1,
                    'answer': 1,
                    'choice': 1,
                }
            },
            {
                $sort: { 'createdAt': -1 }
            }
        ])
        return res.send(document)
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findBytopic ' + error })
        )
    }
};


exports.findByTeam = async (req, res, next) => {
    const { id } = req.params;
    try {
        const document = await model.aggregate([
            // lọc ra các phần muốn lấy
            {
                $match: {
                    team: ObjectId(id),
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
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
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
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
                    from: 'answers',
                    localField: '_id',
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
                    from: 'topics',
                    localField: 'topic',
                    foreignField: '_id',
                    as: 'topics',

                },
            },
            {
                $lookup: {
                    from: 'teams',
                    localField: 'topics.team',
                    foreignField: '_id',
                    as: 'topicsTeam',

                },
            },

            {
                $lookup: {
                    from: 'teams',
                    localField: 'team',
                    foreignField: '_id',
                    as: 'team',

                },
            },

            {
                $lookup: {
                    from: 'status',
                    localField: 'status',
                    foreignField: '_id',
                    as: 'statusQuestion',
                },
            },

            {
                $lookup: {
                    from: 'status',
                    localField: 'team.status',
                    foreignField: '_id',
                    as: 'statusTeam',
                },
            },
            {
                $lookup: {
                    from: 'status',
                    localField: 'topicsTeam.status',
                    foreignField: '_id',
                    as: 'statusTopicsTeam',
                },
            },

            {
                $lookup: {
                    from: 'answers',
                    localField: '_id',
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
                    'title': 1,
                    'image_cover_url': 1,
                    'createdAt': 1,
                    "author._id": 1,
                    "author.name": 1,
                    'author.avatar_url': 1,
                    "tag._id": 1,
                    "tag.name": 1,
                    'view': 1,
                    'comment': 1,
                    'vote': 1,
                    'team': 1,
                    'answer': 1,
                    'choice': 1,
                    isTopic: {
                        $cond: {
                            if: {
                                $eq: ['$topics', []]
                            },
                            then: true,
                            else: { $eq: ['$topics.team', [ObjectId(id)]] }
                        }
                    },
                    isPublic: {
                        $cond: {
                            if: {
                                $eq: ['$statusQuestion.name', ['private']]
                            },
                            then: false,
                            else: true
                        }
                    }

                }
            },
            {
                $match: {
                    isTopic: true,
                    isPublic: true,
                }
            },
            {
                $sort: { 'createdAt': -1 }
            }
        ])
        return res.send(document)
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findBytopic ' + error })
        )
    }
};


exports.findByAuthor = async (req, res, next) => {
    const { id } = req.params;
    try {
        const document = await model.aggregate([
            // lọc ra các phần muốn lấy
            {
                $match: {
                    author: ObjectId(id),
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
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
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
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
                $lookup: {
                    from: 'answers',
                    localField: '_id',
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
                    localField: '_id',
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
                    'title': 1,
                    'image_cover_url': 1,
                    'createdAt': 1,
                    "author._id": 1,
                    "author.name": 1,
                    'author.avatar_url': 1,
                    "tag._id": 1,
                    "tag.name": 1,
                    'view': 1,
                    'comment': 1,
                    'vote': 1,
                    'team': 1,
                    'answer': 1,
                    'choice': 1,
                }
            },
            {
                $sort: { 'createdAt': -1 }
            }
        ])
        return res.send(document)
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findBytopic ' + error })
        )
    }
};


exports.findByTag = async (req, res, next) => {
    const { id } = req.params;
    try {
        const document = await model.aggregate([
            // lọc ra các phần muốn lấy
            {
                $match: {
                    tag: ObjectId(id),
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
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
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
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
                    from: 'answers',
                    localField: '_id',
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
                    localField: '_id',
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
                $lookup: {
                    from: 'topics',
                    localField: 'topic',
                    foreignField: '_id',
                    as: 'topics',

                },
            },
            {
                $lookup: {
                    from: 'teams',
                    localField: 'topics.team',
                    foreignField: '_id',
                    as: 'topicsTeam',

                },
            },

            {
                $lookup: {
                    from: 'teams',
                    localField: 'team',
                    foreignField: '_id',
                    as: 'team',

                },
            },

            {
                $lookup: {
                    from: 'status',
                    localField: 'status',
                    foreignField: '_id',
                    as: 'statusQuestion',
                },
            },

            {
                $lookup: {
                    from: 'status',
                    localField: 'team.status',
                    foreignField: '_id',
                    as: 'statusTeam',
                },
            },
            {
                $lookup: {
                    from: 'status',
                    localField: 'topicsTeam.status',
                    foreignField: '_id',
                    as: 'statusTopicsTeam',
                },
            },

            {
                $project: {
                    "_id": 1,
                    'title': 1,
                    'image_cover_url': 1,
                    'createdAt': 1,
                    "author._id": 1,
                    "author.name": 1,
                    'author.avatar_url': 1,
                    "tag._id": 1,
                    "tag.name": 1,
                    'view': 1,
                    'comment': 1,
                    'vote': 1,
                    'team': 1,
                    'answer': 1,
                    'choice': 1,
                    isPublic: {
                        $cond: {
                            if: {
                                $or: [
                                    { $eq: ['$statusQuestion.name', ['private']] },
                                    {
                                        $and: [
                                            { $eq: ['$statusTeam.name', ['private']] },
                                            { $eq: ['$topics', []] }
                                        ]
                                    },
                                    { $eq: ['$statusTopicsTeam.name', ['private']] },
                                ]
                            },
                            then: false,
                            else: true
                        }
                    }
                }
            },
            {
                $match: {
                    isPublic: true,
                }
            },
            {
                $sort: { 'createdAt': -1 }
            }
        ])
        return res.send(document)
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findBytopic ' + error })
        )
    }
};


exports.create = async (req, res, next) => {
    console.log(req.body);
    const modelO = new model({
        author: req.body.author,
        title: req.body.title ?? 'tiêu đề nè :3',
        content: req.body.content,
        tag: req.body.tag,
        topic: req.body.topic,
        team: req.body.team,
        status: req.body.status,
        course: req.body.course,
        view: parseInt(0),
    })
    try {
        const document = modelO.save().then(savedDoc => {
            return res.send(savedDoc.id);
        });
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể create model' + error })
        )
    }
}

exports.getLength = async (req, res, next) => {
    try {
        const document = await model.find()
        return res.json(document.length);
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy getLength' + error })
        )
    }
};


exports.findAll2 = async (req, res, next) => {
    try {
        const document = await model.find().populate({
            path: 'author topic team tag status view',
            select: 'name id avatar_url'
        }).sort({ 'createdAt': -1 })
        return res.json(document);
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findAll b ' + error })
        )
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const document = await model.aggregate([
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
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
                    from: 'answers',
                    localField: '_id',
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
                    localField: '_id',
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
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
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
                    from: 'topics',
                    localField: 'topic',
                    foreignField: '_id',
                    as: 'topics',

                },
            },
            {
                $lookup: {
                    from: 'teams',
                    localField: 'topics.team',
                    foreignField: '_id',
                    as: 'topicsTeam',

                },
            },

            {
                $lookup: {
                    from: 'teams',
                    localField: 'team',
                    foreignField: '_id',
                    as: 'team',

                },
            },

            {
                $lookup: {
                    from: 'status',
                    localField: 'status',
                    foreignField: '_id',
                    as: 'statusQuestion',
                },
            },

            {
                $lookup: {
                    from: 'status',
                    localField: 'team.status',
                    foreignField: '_id',
                    as: 'statusTeam',
                },
            },
            {
                $lookup: {
                    from: 'status',
                    localField: 'topicsTeam.status',
                    foreignField: '_id',
                    as: 'statusTopicsTeam',
                },
            },
            {
                $project: {
                    "_id": 1,
                    'title': 1,
                    'image_cover_url': 1,
                    'createdAt': 1,
                    "author._id": 1,
                    "author.name": 1,
                    'author.avatar_url': 1,
                    "tag._id": 1,
                    "tag.name": 1,
                    'view': 1,
                    'comment': 1,
                    'vote': 1,
                    'answer': 1,
                    'choice': 1,
                    isPublic: {
                        $cond: {
                            if: {
                                $or: [
                                    { $eq: ['$statusQuestion.name', ['private']] },
                                    {
                                        $and: [
                                            { $eq: ['$statusTeam.name', ['private']] },
                                            { $eq: ['$topics', []] }
                                        ]
                                    },
                                    { $eq: ['$statusTopicsTeam.name', ['private']] },
                                ]
                            },
                            then: false,
                            else: true
                        }
                    }
                }
            },
            {
                $match: {
                    isPublic: true,
                }
            },
            {
                $sort: { createdAt: -1 }
            },
        ])
        return res.json(document);
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findAll a ' + error })
        )
    }
};

exports.findOne = async (req, res, next) => {

    const { id, user } = req.params;

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
                    from: 'comments',
                    localField: '_id',
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
                $lookup: {
                    from: 'votes',
                    localField: '_id',
                    foreignField: 'post',
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
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
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
                $lookup: {
                    from: 'tags',
                    localField: 'tag',
                    foreignField: '_id',
                    as: 'tag',
                },
            },
            {
                $lookup: {
                    from: 'teams',
                    localField: 'team',
                    foreignField: '_id',
                    as: 'team',
                },
            },
            {
                $lookup: {
                    from: 'topics',
                    localField: 'topic',
                    foreignField: '_id',
                    as: 'topic',
                },
            },
            {
                $lookup: {
                    from: 'answers',
                    localField: '_id',
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
                    localField: '_id',
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
                $lookup: {
                    from: 'courses',
                    localField: 'course',
                    foreignField: '_id',
                    as: 'course',

                },
            },
            {
                $project: {
                    "_id": 1,
                    'title': 1,
                    'content': 1,
                    'image_cover_url': 1,
                    'createdAt': 1,
                    "author._id": 1,
                    "author.name": 1,
                    'author.avatar_url': 1,
                    "tag._id": 1,
                    "tag.name": 1,
                    'view': 1,
                    'comment': 1,
                    'vote': 1,
                    'vote_user': 1,
                    'status': 1,
                    'team._id': 1,
                    'topic._id': 1,
                    'team.name': 1,
                    'topic.name': 1,
                    'choice': 1,
                    'answer': 1,
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
            res.status(500).json({ Message: 'không  thể  lấy findAll c ' + error })
        )
    }
}


exports.findOneGuest = async (req, res, next) => {

    const { id } = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id : null,
    };

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
                    from: 'comments',
                    localField: '_id',
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
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
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
                $lookup: {
                    from: 'teams',
                    localField: 'team',
                    foreignField: '_id',
                    as: 'team',
                },
            },
            {
                $lookup: {
                    from: 'topics',
                    localField: 'topic',
                    foreignField: '_id',
                    as: 'topic',
                },
            },
            {
                $lookup: {
                    from: 'answers',
                    localField: '_id',
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
                    localField: '_id',
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
                $lookup: {
                    from: 'courses',
                    localField: 'course',
                    foreignField: '_id',
                    as: 'course',

                },
            },
            {
                $project: {
                    "_id": 1,
                    'title': 1,
                    'content': 1,
                    'image_cover_url': 1,
                    'createdAt': 1,
                    "author._id": 1,
                    "author.name": 1,
                    'author.avatar_url': 1,
                    "tag._id": 1,
                    "tag.name": 1,
                    'view': 1,
                    'comment': 1,
                    'vote': 1,
                    'status': 1,
                    'team.id': 1,
                    'topic.id': 1,
                    'team.name': 1,
                    'topic.name': 1,
                    'choice': 1,
                    'answer': 1,
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
            res.status(500).json({ Message: 'không  thể  lấy findAll d ' + error })
        )
    }
}


exports.findOneEdit = async (req, res, next) => {

    const { id } = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id : null,
    };

    try {
        const document = await model.findOne(condition)
            .populate({
                path: 'topic',
                select: 'name id team',
                populate: {
                    path: 'team',
                    select: 'name id'
                }
            })
            .populate({
                path: 'author team tag status view course',
                select: 'name id avatar_url',
            })
        if (!document) {
            return next(res.status(404).json({ Message: "không thể tìm thấy model  " }));
        }
        return res.json(document);
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findOneEdit  ' + error })
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
        if (req.body.topic == ' ') {
            await model.findByIdAndUpdate(condition, { $unset: { topic: 1 } });
            delete req.body.topic;
        }

        if (req.body.team == ' ') {
            await model.findByIdAndUpdate(condition, { $unset: { team: 1 } });
            delete req.body.team;
        }

        if (req.body.course == ' ') {
            await model.findByIdAndUpdate(condition, { $unset: { course: 1 } });
            delete req.body.course;
        }

        const document = await model.findByIdAndUpdate(condition, req.body, {
            new: true,
        });
        if (!document) {
            return next(res.status(404).json({ Message: "không thể tìm thấy model" }));
        }
        return res.send({ message: "đã update thành công", body: req.body });
    }
    catch (error) {
        return next(
            res.status(500).json({ Message: ` không thể update model với id = ${req.params.id} ` + error })
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



