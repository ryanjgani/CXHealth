const jwt = require("jsonwebtoken");

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

module.exports = isAuth;
