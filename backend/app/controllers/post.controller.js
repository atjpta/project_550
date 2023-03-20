const mongoose = require("mongoose");
const DB = require("../models");
const model = DB.post;
const ObjectId = mongoose.Types.ObjectId;
const status = DB.status

exports.updateSeries = async (req, res, next) => {
    const { id } = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id : null,
    };
    try {
        if (Object.keys(req.body).length === 0) {
            // xóa series
            const document = await model.findByIdAndUpdate(condition, { $unset: { series: 1, team: 1 } })

            if (!document) {
                return next(res.status(404).json({ Message: "không thể tìm thấy model" }));
            }
            return res.send({ message: "đã xóa khỏi Series thành công", body: req.body });
        }
        else {
            if (!req.body.team) {
                await model.findByIdAndUpdate(condition, { $unset: { team: 1 } });
                delete req.body.team;
            }
            // add series
            const document = await model.findByIdAndUpdate(condition, req.body, {
                new: true
            });
            if (!document) {
                return next(res.status(404).json({ Message: "không thể tìm thấy model" }));
            }
            return res.send({ message: "đã theo vào Series  thành công", body: req.body });
        }
        
    }
    catch (error) {
        return next(
            res.status(500).json({ Message: ` không thể update model với id = ${req.params.id} ` })
        )
    }
}

exports.findByNoSeries = async (req, res, next) => {
    const { id } = req.params;
    try {
        const document = await model.aggregate([
            // lọc ra các phần muốn lấy
            {
                $match: {
                    series: null,
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
                }
            },
            {
                $sort: { 'createdAt': -1 }
            }
        ])
        return res.send(document)
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findBySeries ' + error })
        )
    }
};

exports.findBySeries = async (req, res, next) => {
    const { id } = req.params;
    try {
        const document = await model.aggregate([
            // lọc ra các phần muốn lấy
            {
                $match: {
                    series: ObjectId(id),
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
                    'series': 1,
                }
            },
            {
                $sort: { 'createdAt': -1 }
            }
        ])
        return res.send(document)
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findBySeries ' + error })
        )
    }
};


exports.create = async (req, res, next) => {
    const modelO = new model({
        author: req.body.author,
        title: req.body.title ?? 'tiêu đề nè :3',
        content: req.body.content,
        tag: req.body.tag,
        image_cover_url: req.body.image_cover_url,
        series: req.body.series,
        team: req.body.team,
        status: req.body.status,
        view: parseInt(0),
        pins: false,
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
            path: 'author series team tag status view',
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
            // lọc ra các phần muốn lấy
            // {
            //     $match: {
            //         team: null,
            //     }
            // },
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
                }
            },
            {
                $sort: { 'createdAt': -1 }
            }
        ])
        return res.json(document);
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findAll a ' + error })
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
                    from: 'status',
                    localField: 'status',
                    foreignField: '_id',
                    as: 'status',
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
                }
            },
            {
                $sort: { 'createdAt': -1 }
            }
        ])
        return res.send(document)
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findBySeries ' + error })
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
                    'pins':1,
                }
            },
            {
                $sort: { 'createdAt': -1 }
            }
        ])
        return res.send(document)
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findBySeries ' + error })
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
                    from: 'status',
                    localField: 'status',
                    foreignField: '_id',
                    as: 'status',
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
                }
            },
            {
                $sort: { 'createdAt': -1 }
            }
        ])
        return res.send(document)
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findBySeries ' + error })
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
                    from: 'series',
                    localField: 'series',
                    foreignField: '_id',
                    as: 'series',
                    
                },
            },
            {
                $lookup: {
                    from: 'teams',
                    localField: 'series.team',
                    foreignField: '_id',
                    as: 'series_team',
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
                    'series._id': 1,
                    'team.name': 1,
                    'series.name': 1,
                    'series_team._id': 1,
                    'series_team.name': 1,

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
                    from: 'series',
                    localField: 'series',
                    foreignField: '_id',
                    as: 'series',
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
                    'series.id': 1,
                    'team.name': 1,
                    'series.name': 1,
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
                path: 'series',
                select: 'name id team',
                populate: {
                    path: 'team',
                    select: 'name id'
                }
            })
            .populate({
                path: 'author team tag status view',
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
        if (req.body.series == ' ') {
            await model.findByIdAndUpdate(condition, { $unset: { series: 1 } });
            delete req.body.series;
        }

        if (req.body.team == ' ') {
            await model.findByIdAndUpdate(condition, { $unset: { team: 1 } });
            delete req.body.team;
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
            res.status(500).json({ Message: ` không thể update model với id = ${req.params.id} ` + error  })
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



