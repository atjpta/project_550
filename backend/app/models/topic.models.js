const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        title: String,
        content: String,
        image_cover_url: {
            type: String,
        },
        tag: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "tag"
        }],
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "team"
        },
        status: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "status"
        }],
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


module.exports = mongoose.model("topic", schema);