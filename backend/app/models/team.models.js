const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {
        image_cover_url: {
            type: String,
            default: 'https://api-project-550.vercel.app/api/image/meo.jpg'
        },
        name: String,
        introduce: String,
        status: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "status"
        }],
        tag: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "tag"
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


module.exports = mongoose.model("team", schema);