const express = require("express");
const wrapasync = require("../utils/wrapasync");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const { saveUrl } = require("../middleware");

const userController = require("../controllers/user");

router
  .route("/signup")
  .get(userController.renderSignUp)
  .post(wrapasync(userController.signUp));

router
  .route("/login")
  .get( userController.renderLoginForm)
  .post(
    saveUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );
router.get("/logout", userController.logout);

module.exports = router;