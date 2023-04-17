
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const DB = require("../models");
const model = DB.review;

exports.findPerPage = async (req, res, next) => {
    const { page, size } = req.params
    try {
        const document = await model.find().sort({ createdAt: -1 }).select('name')
            .limit(size)
            .skip(size * (page - 1))
        return res.json(document);
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findAllPage' + error })
        )
    }
};

exports.maxLength = async (req, res, next) => {
    try {
        const document = (await model.find()).length
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
        course: req.body.course,
        level: req.body.level,
        quality: req.body.quality,
        useful: req.body.useful,
        importance: req.body.importance,
        popularity: req.body.popularity,
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
        const document = await model.find().sort({ createdAt: -1 })
        return res.json(document);
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findAll' + error })
        )
    }
};

exports.findAvg = async (req, res, next) => {
    const { course } = req.params
    try {
        let document = {}
        let document2 = await model.find({ course: course })

        let totalLevel = 0;
        let totalQuality = 0;
        let totalUseful = 0;
        let totalImportance = 0;
        let totalPopularity = 0;

        for (let i = 0; i < document2.length; i++) {
            totalLevel += parseInt(document2[i].level);
            totalQuality += parseInt(document2[i].quality);
            totalUseful += parseInt(document2[i].useful);
            totalImportance += parseInt(document2[i].importance);
            totalPopularity += parseInt(document2[i].popularity);
        }

        document.level = totalLevel / document2.length;
        document.quality = totalQuality / document2.length;
        document.useful = totalUseful / document2.length;
        document.importance = totalImportance / document2.length;
        document.popularity = totalPopularity / document2.length;
        document.size = document2.length
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

exports.findOneEdit = async (req, res, next) => {
    const { user, course } = req.params;

    try {
        const document = await model.findOne({
            author: user,
            course: course,
        })
        if (!document) {
            return next(res.status(401).json({ Message: "không thể tìm thấy model" }));
        }
        return res.json(document);
    } catch (error) {
        return next(
            res.status(500).json({ Message: 'không  thể  lấy findOneEdit' + error })
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



