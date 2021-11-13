const express = require("express");
const router = express.Router();

// const Appointment = require("../models/appointments");
// const Doctor = require("../models/doctors");
// const Registrations = require("../models/registrations");
// const CatchAsync = require("../utils/CatchAsync");
// const isAuth = require("../middleware/check-auth");

//controllers
// const {
//     getAppointment,
//     getNewAppointment,
//     postNewAppointment,
//     showAppointment,
//     updateAppointment,
//     deleteAppointment,
//     editAppointment,
//     deletePatientAppointment,
// } = require("../controllers/admin");

// router.use(isAuth);
// router.use((req, res, next) => {
//     if (req.user.role !== "admin") {
//         res.redirect("/");
//     } else {
//         next();
//     }
// });

router.get("/dashboard", (req, res) => {
    res.render("dashboard/dashboard");
});

router.get("/esports", (req, res) => {
    res.render("dashboard/esports");
});

router.get("/sports", (req, res) => {
    res.render("dashboard/sports");
});

router.get("/vaccination", (req, res) => {
    res.render("dashboard/vaccination");
});

router.get("/shop", (req, res) => {
    res.render("dashboard/shop");
});

router.get("/distance", (req, res) => {
    res.render("dashboard/distance");
});

router.get("/rewards", (req, res) => {
    res.render("dashboard/rewards");
});

module.exports = router;
