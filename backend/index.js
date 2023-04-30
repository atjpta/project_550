const app = require('./app');
const config = require('./app/config');
const mongoose = require("mongoose");
const model = require('./app/models');

const { MongoClient } = require('mongodb')

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

mongoose.set("strictQuery", false);
//connet to database
mongoose.connect(config.db.uri)
  .then(() => {
    console.log("Conneted to the database!");
    model.innitDB();

  })
  .catch((error) => {
    console.log("Cannot connet to the database!", error);
    process.exit();
  });

//start sv
const PORT = config.app.port;
app.listen(PORT, () => {
  console.log(`Server is running on port${PORT}.`);
});


