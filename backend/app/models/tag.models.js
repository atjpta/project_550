const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        name: String,
        introduce: String
    },
);

schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});


module.exports = mongoose.model("tag", schema);