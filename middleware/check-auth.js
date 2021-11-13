const jwt = require("jsonwebtoken");

const isAuth = async (req, res, next) => {
    let isLoggedIn = true;
    const token = req.cookies.jwt;
    if (!token) {
        next();
    } else {
        try {
            const decodedToken = jwt.decode(token);
            if (!decodedToken) {
                throw new Error("Unable to verify token");
            }
            // console.log(decodedToken);
            const { email } = decodedToken;
            const user = {
                email,
            };
            res.locals.currentUser = user;
            req.user = user;
            next();
        } catch (e) {
            console.log(
                `Token verification failed due to reason: ${e.message}`
            );
            next();
        }
    }
};

module.exports = isAuth;
