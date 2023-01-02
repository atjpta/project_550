const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        content: String,
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post"
        },
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "question"
        },
        topic: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "topic"
        },
        series: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "series"
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    },
);

schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = mongoose.model("report", schema);