const mongoose = require("mongoose");
const DB = require("../models");
const model = DB.topic;
const ObjectId = mongoose.Types.ObjectId;


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
                    'name': 1,
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
        filter = 'valScore'
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
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                },
            },
            {
                $lookup: {
                    from: 'questions',
                    localField: '_id',
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
                    localField: '_id',
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
                    from: 'questions',
                    localField: '_id',
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
                    'name': 1,
                    'introduce': 1,
                    'image_cover_url': 1,
                    'createdAt': 1,
                    "author._id": 1,
                    "author.name": 1,
                    'author.avatar_url': 1,
                    'question.count': 1,
                    'valScore': 1,
                    'listtag': 1,

                }
            },

            {
                $sort: { 'valScore': -1, createdAt: -1 }
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


exports.create = async (req, res, next) => {
    const modelO = new model({
        author: req.body.author,
        name: req.body.name ?? 'tên nè :3',
        image_cover_url: req.body.image_cover_url ?? 'https://axqkgnmnmrlddosqokpa.supabase.co/storage/v1/object/public/blog-files/image/meo.jpg',
        introduce: req.body.introduce,
    })
    try {
        await modelO.save((error, doc) => {
            if (error) {
                return res.status(500).send({ message: error + 'không lưu được' });
            }

            return res.send(doc.id);
        });

    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể create model' + error })
        )
    }
};


exports.findOneEdit = async (req, res, next) => {
    const { id } = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id : null,
    };

    try {
        const document = await model.findOne(condition).populate({
            path: 'author status tag',
            select: 'id name avatar_url'
        }).sort({ 'createdAt': -1 })
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

exports.findAll2 = async (req, res, next) => {
    try {
        const document = await model.find({ _id: { $ne: req.params.id } }).sort({ 'createdAt': -1 })
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
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                },
            },
            {
                $lookup: {
                    from: 'questions',
                    localField: '_id',
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
                    localField: '_id',
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
                    from: 'questions',
                    localField: '_id',
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
                    'name': 1,
                    'introduce': 1,
                    'image_cover_url': 1,
                    'createdAt': 1,
                    "author._id": 1,
                    "author.name": 1,
                    'author.avatar_url': 1,
                    'question.count': 1,
                    'valScore': 1,
                    'listtag': 1,
                }
            },

            {
                $sort: { 'valScore': -1, createdAt: -1 }
            },
        ])
        return res.json(document);
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findAll aaaaaaaaa' + error })
        )
    }
};

exports.findByUserTeam = async (req, res, next) => {
    const { id, team } = req.params;

    try {
        const document = await model.find({ team: team }).populate({
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
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                },
            },
            {
                $lookup: {
                    from: 'questions',
                    localField: '_id',
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
                    localField: '_id',
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
                    localField: 'status',
                    foreignField: '_id',
                    as: 'status',
                },
            },

            {
                $lookup: {
                    from: 'questions',
                    localField: '_id',
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
                    'name': 1,
                    'introduce': 1,
                    'image_cover_url': 1,
                    'createdAt': 1,
                    "author._id": 1,
                    "author.name": 1,
                    'author.avatar_url': 1,
                    'question.count': 1,
                    'valScore': 1,
                    'listtag': 1,
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
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                },
            },
            {
                $lookup: {
                    from: 'questions',
                    localField: '_id',
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
                    localField: '_id',
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
                    from: 'questions',
                    localField: '_id',
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
                    'name': 1,
                    'introduce': 1,
                    'image_cover_url': 1,
                    'createdAt': 1,
                    "author._id": 1,
                    "author.name": 1,
                    'author.avatar_url': 1,
                    'question.count': 1,
                    'valScore': 1,
                    'listtag': 1,

                }
            },

            {
                $sort: { 'valScore': -1, createdAt: -1 }
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
            // lọc ra các phần muốn lấy
            {
                $match: {
                    author: ObjectId(id),
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
                    from: 'questions',
                    localField: '_id',
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
                    localField: '_id',
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
                    localField: 'status',
                    foreignField: '_id',
                    as: 'status',
                },
            },

            {
                $lookup: {
                    from: 'questions',
                    localField: '_id',
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
                    'name': 1,
                    'introduce': 1,
                    'image_cover_url': 1,
                    'createdAt': 1,
                    "author._id": 1,
                    "author.name": 1,
                    'author.avatar_url': 1,
                    'question.count': 1,
                    'valScore': 1,
                    'listtag': 1,
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
            // lọc ra các phần muốn lấy

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
                    from: 'questions',
                    localField: '_id',
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
                    localField: '_id',
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
                    from: 'questions',
                    localField: '_id',
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
                $match: {
                    "tag.list._id": ObjectId(id)
                }
            },
            {
                $addFields: {
                    listtag: "$tag.list"
                }
            },
            {
                $project: {
                    "_id": 1,
                    'name': 1,
                    'introduce': 1,
                    'image_cover_url': 1,
                    'createdAt': 1,
                    "author._id": 1,
                    "author.name": 1,
                    'author.avatar_url': 1,
                    'question.count': 1,
                    'valScore': 1,
                    'listtag': 1,

                }
            },

            {
                $sort: { 'valScore': -1, createdAt: -1 }
            },
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
        const document = await model.find({ author: id }).populate({
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
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                },
            },
            {
                $lookup: {
                    from: 'questions',
                    localField: '_id',
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
                    localField: '_id',
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
                                            _id: '$pots',
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
                    from: 'questions',
                    localField: '_id',
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
                    'name': 1,
                    'introduce': 1,
                    'image_cover_url': 1,
                    'createdAt': 1,
                    "author._id": 1,
                    "author.name": 1,
                    'author.avatar_url': 1,
                    'question.count': 1,
                    'valScore': 1,
                    'listtag': 1,
                    'team.name': 1,
                    'team._id': 1,

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
        if (req.body.team == ' ') {
            await model.findByIdAndUpdate(condition, { $unset: { team: 1 } });
            delete req.body.team;
        }

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



