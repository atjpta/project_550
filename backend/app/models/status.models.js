const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {
        name: String
    }
);

schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const status = mongoose.model("status", schema)

function initStatus() {
    status.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new status({
                name: "public"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'public' to status collection");
            });
            new status({
                name: "private"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'private' to status collection");
            });
            new status({
                name: "ban"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'ban' to status collection");
            });
            new status({
                name: "answer"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'ban' to status collection");
            });
            new status({
                name: "seen"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'seen' to status collection");
            });
            
        }
    });
}


module.exports = {
    status,
    initStatus,
};