const config = require("../config");
const Models = require("../models/");
const User = Models.user;
const Role = Models.role;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = (req, res, next) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    name: req.body.name,
    password: bcrypt.hashSync(req.body.password, 8),
    avatar_url: 'https://axqkgnmnmrlddosqokpa.supabase.co/storage/v1/object/public/blog-files/image/meo.jpg'
  });

  Role.findOne({ name: req.body.role || 'user' }, (err, doc_role) => {
    if (err || doc_role == null ) {
      return next(res.status(500).send({ message: err + 'không tìm thấy role do' }));
    }
    user.role = doc_role.id
    user.save(err => {
      if (err) {
        return next(res.status(500).send({ message: err + 'khong thể tạo acc user' }));
      }
      res.send({ message: "Đăng kí tài khoản thành công!" });
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate({
      path: 'role',
    })
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
      // const token = jwt.sign({ id: user.id }, config.jwt.secret, {
      //   expiresIn: config.jwt.tokenLife
      // });
      const token = jwt.sign({ id: user.id }, config.jwt.secret);
      res.status(200).send({
        id: user._id,
        accessToken: token,
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
