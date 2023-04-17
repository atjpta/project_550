const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        name: String,
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

const typecourse = mongoose.model("typecourse", schema)

function initTypeCourse() {
    typecourse.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new typecourse({
                name: "khác"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'khác' to typecourses collection");
            });
            new typecourse({
                name: "đại cương"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'đại cương' to typecourses collection");
            });
            new typecourse({
                name: "cơ sở ngành"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'cơ sở ngành' to typecourses collection");
            });
            new typecourse({
                name: "chuyên ngành"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'chuyên ngành' to typecourses collection");
            });

        }
    });
}


module.exports = {
    typecourse,
    initTypeCourse,
};