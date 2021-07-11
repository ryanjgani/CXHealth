const express = require("express");
const router = express.Router();

const Appointment = require("../models/appointments");
const Doctor = require("../models/doctors");
const Registration = require("../models/registrations");
const isAuth = require("../middleware/check-auth");
const appointments = require("../models/appointments");

router.use(isAuth);
router.use((req, res, next) => {
    if (req.user.role !== "patient") {
        res.redirect("/");
    } else {
        next();
    }
});

router.get("/", async (req, res) => {
    const appointments = await Appointment.find({}).populate("doctor");
    res.render("patient/index", { appointments });
});

router.get("/myappointments", async (req, res) => {
    const registrations = await Registration.find({
        patient: req.user.id,
        cancelled: false,
    }).populate({
        path: "appointment",
        populate: {
            path: "doctor",
            model: "Doctor",
        },
    });
    // const appointments = await Appointment.find({});
    res.render("patient/myappointments", { registrations });
});

router.route("/:id").get(async (req, res) => {
    const { id } = req.params;
    const appointment = await Appointment.findById(id).populate("doctor");
    const currentRegistrations = await Registration.count({
        patient: req.user.id,
        appointment: id,
        cancelled: false,
    });
    res.render("patient/show", {
        appointment,
        registered: currentRegistrations > 0,
    });
});

router.post("/:id/register", async (req, res) => {
    const { id } = req.params; //appointment id
    const currentRegistrations = await Registration.count({
        patient: req.user.id,
        appointment: id,
        cancelled: false,
    });

    if (currentRegistrations > 0) {
        req.flash("error", "You have an existing registration.");
        res.redirect(`/patient/appointments/${id}`);
        return;
    }

    const appointmentRegistrationsCount = await Registration.count({
        appointment: id,
        cancelled: false,
    });

    const appointment = await Appointment.findById(id);
    if (!appointment) {
        res.redirect("/patient/appointments");
        return;
    }

    if (appointmentRegistrationsCount >= appointment.registrantLimit) {
        req.flash("error", "This appointment is currently full!");
        res.redirect(`/patient/appointments/${id}`);
        return;
    }

    const newRegistration = new Registration({
        registered_at: new Date(),
        patient: req.user.id,
        appointment: id,
    });

    appointment.registrations.push(newRegistration);

    await appointment.save();
    await newRegistration.save();

    req.flash("success", "You have registered for an appointment!");
    res.redirect(`/patient/appointments/${id}`);
});

router.post("/:id/cancel", async (req, res) => {
    const { id } = req.params; //appointment id
    await Registration.findOneAndUpdate(
        {
            patient: req.user.id,
            appointment: id,
            cancelled: false,
        },
        {
            cancelled: true,
            cancelled_at: new Date(),
        }
    );

    req.flash("success", "You have cancelled an appointment!");
    res.redirect(`/patient/appointments/${id}`);
});

module.exports = router;
