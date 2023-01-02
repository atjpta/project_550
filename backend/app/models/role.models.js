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

const Role = mongoose.model("Role", schema)

function initRole() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'user' to roles collection");
            });
            new Role({
                name: "moderator"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'moderator' to roles collection");
            });
            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'admin' to roles collection");
            });
            new Role({
                name: "chief"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'chief' to roles collection");
            });
            new Role({
                name: "handler"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'handler' to roles collection");
            });
            new Role({
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
    Role,
    initRole,
};