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

const notificationtype = mongoose.model("notificationtype", schema)

function initNotificationtype() {
    notificationtype.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new notificationtype({
                name: "info"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'info' to notificationtype collection");
            });
            new notificationtype({
                name: "waring"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'waring' to notificationtype collection");
            });
            new notificationtype({
                name: "error"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'error' to notificationtype collection");
            });
            
        }
    });
}


module.exports = {
    notificationtype,
    initNotificationtype,
};