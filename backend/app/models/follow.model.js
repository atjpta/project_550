const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }, 
        follow: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        notification: Boolean,
    },
);

schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});


module.exports = mongoose.model("follow", schema);