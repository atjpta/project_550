const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        content: String,
        model: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post"
        },
    },
);

schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = mongoose.model("report", schema);