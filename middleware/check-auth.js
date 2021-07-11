const jwt = require("jsonwebtoken");

// const isAuth = (req, res, next) => {
//     const token = req.cookies.jwt;
//     console.log(token);

//     if (token) {
//         console.log("success");
//         jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
//             if (err) {
//                 req.flash("error", "err.message");
//                 res.redirect("/login");
//             } else {
//                 console.log(decodedToken);
//                 next();
//             }
//         });
//     } else {
//         console.log("fail");

//         req.flash("error", "You are not logged in!");
//         res.redirect("/login");
//     }
// };

const isAuth = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        res.redirect("/login");
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        if (!decodedToken) {
            throw new Error("Unable to verify token");
        }
        const { id, role } = decodedToken;
        const user = {
            id,
            role,
        };
        res.locals.currentUser = user;
        req.user = user;
        console.log(
            `Request from user ID: ${id}, role ${role}, on ${new Date().toISOString()}`
        );
        next();
    } catch (e) {
        console.log(
            `Token ${token} verification failed due to reason: ${e.message}`
        );
        res.redirect("/login");
    }
};

// const isAuth = (req, res, next) => {
//     console.log("isauth middleware!");
//     next();
// };
module.exports = isAuth;
