const express = require("express");
const router = express.Router();

//Controllers
const {
    getRegisterForm,
    postRegisterForm,
    getLoginForm,
    postLoginForm,
    logout,
} = require("../controllers/users");

router.route("/register").get(getRegisterForm).post(postRegisterForm);

router.route("/login").get(getLoginForm).post(postLoginForm);

router.route("/logout").get(logout);

module.exports = router;
