const User = require("../models/users");
const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");
const { rawListeners } = require("../models/users");

const maxAge = 24 * 60 * 60;
const cookieMaxAge = maxAge * 1000;
const createToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_KEY, {
        expiresIn: maxAge,
    });
};

module.exports.getRegisterForm = (req, res) => {
    res.render("users/register");
};
module.exports.postRegisterForm = async (req, res) => {
    const { email, password } = req.body;
    axios
        .post(
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBQJdDg1_ox5j4LAw1VTyQ3-EfUfXkHAeM",
            {
                email,
                password,
                returnSecureToken: true,
            }
        )
        .then((resp) => {
            console.log("SUCCESS");
            const { idToken } = resp.data;
            res.cookie("jwt", idToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
            });
            console.log("Sign Up Success from User", res.data.email);
            req.flash("success", "Sign Up Successfull!");
            res.redirect("/");
        })
        .catch((e) => {
            console.log("SINI", e);

            if (e.response) console.log(e.response.data);
            else if (e.request) console.log(e.request.data);
            else console.log(e.message);
            req.flash("error", `Authentication Failed due to ${e.message}`);
            res.redirect("/");
        });
};

module.exports.getLoginForm = (req, res) => {
    res.render("users/login");
};

module.exports.postLoginForm = async (req, res) => {
    const { email, password } = req.body;
    axios
        .post(
            "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBQJdDg1_ox5j4LAw1VTyQ3-EfUfXkHAeM",
            {
                email,
                password,
                returnSecureToken: true,
            }
        )
        .then((resp) => {
            const { idToken } = resp.data;
            res.cookie("jwt", idToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
            });
            console.log("Sign In Success from User", resp.data.email);
            req.flash("success", "Sign In Successfull!");
            res.redirect("/dashboard");
        })
        .catch((e) => {
            console.log(e);
            if (e.response) console.log(e.response.data);
            else if (e.request) console.log(e.request.data);
            else console.log(e.message);
            req.flash("error", `Wrong Username or Password`);
            res.redirect("/");
        });
    // try {
    //     const user = await User.login(username, password);
    //     const token = createToken(user._id, user.role);
    //     res.cookie("jwt", token, { httpOnly: true, maxAge: cookieMaxAge });

    //     req.flash("success", "Welcome Back!");

    //     if (user.role === "admin") {
    //         res.redirect("/admin/appointments");
    //     } else {
    //         res.redirect("/patient/appointments");
    //     }
    // } catch (e) {
    //     console.error(e);
    //     req.flash("error", "Wrong Username or Password");
    //     res.redirect("/");
    // }
};

module.exports.logout = (req, res) => {
    res.clearCookie("jwt", { httpOnly: true });
    res.redirect("/");
};
