const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {
        username: {
            type: String,
            require: [true, "username is required"],
        },
        avatar_url: {
            type: String,
            default: 'https://api-project-550.vercel.app/api/image/meo.jpg'
        },
        email: {
            type: String,
            trim: true,
            lowercas: true,
        },

        password: String,
        name: String,
        introduce: String,
        score: {
            type: Intl,
            default: 0,
        },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        },
        status: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "status"
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


module.exports = mongoose.model("user", schema);