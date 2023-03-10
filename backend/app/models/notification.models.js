const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        content: String,
        type: String,
        view: Boolean,
        url: String,
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

module.exports = mongoose.model("notification", schema);