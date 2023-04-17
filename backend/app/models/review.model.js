const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "course"
        },
        level: String,
        quality: String,
        useful: String,
        importance: String,
        popularity: String,
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


module.exports = mongoose.model("review", schema);