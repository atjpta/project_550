const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {

        post_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post"
        },
        question_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "question"
        },
        answer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "answer"
        },
        content: Object,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        cmt_child: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment"
        }],
        tag_name: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }]
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

module.exports = mongoose.model("comment", schema);