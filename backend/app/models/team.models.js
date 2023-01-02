const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {
        image_cover_url: {
            type: String,
            default: 'http://localhost:8088/api/image/meo.jpg'
        },
        name: String,
        introduce: String,
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


module.exports = mongoose.model("team", schema);