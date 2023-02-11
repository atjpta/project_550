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

const role = mongoose.model("role", schema)

function initRole() {
    role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'user' to roles collection");
            });
            new role({
                name: "moderator"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'moderator' to roles collection");
            });
            new role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'admin' to roles collection");
            });
            new role({
                name: "chief"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'chief' to roles collection");
            });
            new role({
                name: "handler"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'handler' to roles collection");
            });
            new role({
                name: "member"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'member' to roles collection");
            });
        }
    });
}


module.exports = {
    role,
    initRole,
};