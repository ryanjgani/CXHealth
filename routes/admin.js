const express = require("express");
const router = express.Router();

const Appointment = require("../models/appointments");
const Doctor = require("../models/doctors");
const Registrations = require("../models/registrations");
const CatchAsync = require("../utils/CatchAsync");
const isAuth = require("../middleware/check-auth");

router.use(isAuth);
router.use((req, res, next) => {
    if (req.user.role !== "admin") {
        res.redirect("/");
    } else {
        next();
    }
});

router.get("/", async (req, res) => {
    const appointments = await Appointment.find({}).populate("doctor");
    res.render("admin/index", { appointments });
});

router
    .route("/new")
    .get(
        CatchAsync(async (req, res) => {
            const doctors = await Doctor.find({});
            res.render("admin/new", { doctors });
        })
    )
    .post(async (req, res, next) => {
        try {
            const doctor = await Doctor.findById(req.body.doctor);

            if (!doctor) {
                res.redirect("/admin/appointments/new");
                return;
            }

            const appointment = new Appointment({
                description: req.body.description,
                registrantLimit: req.body.registrantLimit,
                doctor: doctor._id,
            });
            await appointment.save();
            req.flash("success", "Successfully Made a New Appointment!");
            res.redirect(`/admin/appointments/${appointment._id}`);
        } catch (e) {
            console.error(e);
            next(e);
        }
    });

router
    .route("/:id")
    .get(async (req, res, next) => {
        try {
            const { id } = req.params;
            const appointment = await Appointment.findById(id).populate(
                "doctor"
            );
            const registrations = await Registrations.find({
                appointment: id,
                cancelled: false,
            }).populate("patient");
            if (!appointment) {
                req.flash("error", "Appoinment Not Found!");
                res.redirect("/admin/appointments");
            }
            res.render("admin/show", { appointment, registrations });
        } catch (e) {
            console.error(e);
            next(e);
        }
    })
    .put(
        CatchAsync(async (req, res) => {
            const { id } = req.params;
            const appointment = await Appointment.findByIdAndUpdate(id, {
                ...req.body,
            });
            req.flash("success", "Successfully Updated Appointment!");
            res.redirect(`/admin/appointments/${appointment._id}`);
        })
    )
    .delete(
        CatchAsync(async (req, res) => {
            const { id } = req.params;
            await Appointment.findByIdAndDelete(id);
            req.flash("success", "Successfully Deleted Appointment!");
            res.redirect("/admin/appointments");
        })
    );

router.get(
    "/:id/edit",
    CatchAsync(async (req, res) => {
        const { id } = req.params;
        const appointment = await Appointment.findById(id).populate("doctor");
        const doctors = await Doctor.find({});
        res.render("admin/edit", { appointment, doctors });
    })
);

router.post("/:appointmentID/:registrationID/cancel", async (req, res) => {
    const { appointmentID, registrationID } = req.params;
    await Registrations.findByIdAndUpdate(registrationID, {
        cancelled: true,
        cancelled_at: new Date(),
    });

    req.flash("success", "You have cancelled an appointment!");
    res.redirect(`/admin/appointments/${appointmentID}`);
});

module.exports = router;
