const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        name: String,
        introduce: String,
        image_cover_url: {
            type: String,
            default: 'https://api-project-550.vercel.app/api/image/meo.jpg',
        },
        tag: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "tag"
        }],
        status: String,
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