const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "team"
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "role"
        },
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


module.exports = mongoose.model("member", schema);