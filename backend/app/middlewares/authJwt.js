const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require('../models')
const User = db.user;
const Role = db.user;


exports.verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.jwt.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  User.findById(req.userId).populate("role", "-__v").exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err + 'không tìm thấy user' });
      return;
    }
    if (user.role.name === "admin" || user.role.name === "moderator") {
        next();
        return;
      }
    res.status(403).send({ message: "Require Admin Role!" });
    return;
  });
};

exports.onlyIsAdmin = (req, res, next) => {
  User.findById(req.userId).populate("role", "-__v").exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err + 'không tìm thấy user' });
      return;
    }
    if (user.role.name === "admin") {
      next();
      return;
    }
    res.status(403).send({ message: "Require Admin Role!" });
    return;
  });
};

exports.isModerator = (req, res, next) => {
  User.findById(req.userId).populate("role", "-__v").exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err + 'không tìm thấy user' });
      return;
    }
    if (user.role.name === "moderator") {
      next();
      return;
    }
    res.status(403).send({ message: "Require moderator Role!" });
    return;
  });
};
