const controller = require("../controllers");
const auth = controller.auth;

const middlewares = require("../middlewares");
const verifySignUp = middlewares.verifySignUp;
const authJwt = middlewares.authJwt;
const express = require("express");

module.exports = (app) => {

  const router = express.Router();

  router.route("/test/all")
    .get(auth.allAccess);
  router.route("/test/user")
    .get([authJwt.verifyToken], auth.userBoard);
  router.route("/test/mod")
    .get([authJwt.verifyToken, authJwt.isModerator], auth.moderatorBoard);
  router.route("/test/admin")
    .get([authJwt.verifyToken, authJwt.isAdmin], auth.adminBoard); 
  router.route("/test/onlyadmin")
    .get([authJwt.verifyToken, authJwt.onlyIsAdmin], auth.onlyAdminBoard); 

  router.route("/signup")
    .post([verifySignUp.checkDuplicateUsernameOrEmail], auth.signup)

  router.route('/signin')
    .post(auth.signin)

  app.use("/api/auth", router); 

 
};