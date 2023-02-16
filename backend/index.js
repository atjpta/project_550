const app = require('./app');
const config = require('./app/config');
const mongodb = require("mongoose");
const model = require('./app/models');

const { default: mongoose } = require('mongoose');
// báo strictQuery qq gì đó
mongoose.set("strictQuery", false);
//connet to database
mongodb.connect(config.db.uri)
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
  console.log(`Sever is running on port${PORT}.`);
});


