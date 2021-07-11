const express = require("express");
const router = express.Router();

const Appointment = require("../models/appointments");
const Doctor = require("../models/doctors");
const Registrations = require("../models/registrations");
const CatchAsync = require("../utils/CatchAsync");
const isAuth = require("../middleware/check-auth");

//controllers
const {
    getAppointment,
    getNewAppointment,
    postNewAppointment,
    showAppointment,
    updateAppointment,
    deleteAppointment,
    editAppointment,
    deletePatientAppointment,
} = require("../controllers/admin");

router.use(isAuth);
router.use((req, res, next) => {
    if (req.user.role !== "admin") {
        res.redirect("/");
    } else {
        next();
    }
});

router.get("/", getAppointment);

router.route("/new").get(getNewAppointment).post(postNewAppointment);

router
    .route("/:id")
    .get(showAppointment)
    .put(updateAppointment)
    .delete(deleteAppointment);

router.get("/:id/edit", editAppointment);

router.post("/:appointmentID/:registrationID/cancel", deletePatientAppointment);

module.exports = router;
