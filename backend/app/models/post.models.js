const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        series: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "series"
        },
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "team"
        },
        tag: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "tag"
        }],
        pins: Boolean,
        title: String,
        content: Object,
        image_cover_url: {
            type: String,
        },
        status: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "status"
        }],
        view: {
            type: Intl,
            defaule: 0,
        }
    },

    {
        timestamps: true,
    }
);

schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});


module.exports = mongoose.model("post", schema);