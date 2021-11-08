const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/check-auth");

//Controllers
const {
    getAppointment,
    myAppointments,
    showAppointment,
    registerAppointment,
    cancelAppointment,
} = require("../controllers/patient");

router.use(isAuth);

router.get("/", getAppointment);

router.use((req, res, next) => {
    if (!req.user || req.user.role !== "patient") {
        req.flash("error", "Please login to make an appointment");
        res.redirect("/login");
    } else {
        next();
    }
});

router.get("/myappointments", myAppointments);

router.route("/:id").get(showAppointment);

router.post("/:id/register", registerAppointment);

router.post("/:id/cancel", cancelAppointment);

module.exports = router;
