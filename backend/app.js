const express = require("express");
const cors = require("cors");
const route = require('./app/routes')
const app = express();

app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({
        limit: '50mb',
        extended: true,
    })
);

app.get("/", (req, res) => {
  res.status(200).json({ message: "welcome" + req.url});
});


route.Start(app);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true)
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.header('Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  next(res.status(404).json({ message: "Resource not found" + req.url }))
});
app.use((error, req, res, next) => {
    if (res == null) {
      res.status(error.status || 500).json({ message: error.message + req.url || "internal Server Error" })
    }
    else {
        console.log(error);
    }
});

module.exports = app;