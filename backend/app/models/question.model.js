const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        topic: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "topic"
        },
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "team"
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "course"
        },
        tag: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "tag"
        }],
        title: String,
        content: Object,
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

module.exports = mongoose.model("question", schema);