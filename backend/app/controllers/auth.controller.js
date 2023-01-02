const config = require("../config");
const Models = require("../models/");
const User = Models.user;
const Role = Models.role;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    name: req.body.name,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  Role.findOne({ name: req.body.role || 'user' }, (err, role) => {
    if (err) {
      return res.status(500).send({ message: err + 'không tìm thấy role do' });
    }
    user.role = role.id
    user.save(err => {
      if (err) {
        return res.status(500).send({ message: err + 'khong thể tạo acc user' });
      }
      res.send({ message: "Đăng kí tài khoản thành công!" });
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("role", "-__v")
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({ message: err + "không thể tìm thấy user" });
      }
      if (!user) {
        return res.status(404).send({ message: "không tìm thấy user!!!!!" });
      }
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password,
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "mật khẩu không đúng!"
        });
      }
      const token = jwt.sign({ id: user.id }, config.jwt.secret, {
        expiresIn: config.jwt.tokenLife
      });
      res.status(200).send({
        id: user._id,
        name: user.name,
        role: user.role,
        accessToken: token,
        avatar_Url: user.avatar_Url,
      });
    });
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};


exports.onlyAdminBoard = (req, res) => {
  res.status(200).send("Only Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};
