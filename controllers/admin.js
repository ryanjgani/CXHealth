const Appointment = require("../models/appointments");
const Doctor = require("../models/doctors");
const Registrations = require("../models/registrations");
const CatchAsync = require("../utils/CatchAsync");

module.exports.getAppointment = async (req, res) => {
    const appointments = await Appointment.find({}).populate("doctor");
    res.render("admin/index", { appointments });
};

module.exports.getNewAppointment = CatchAsync(async (req, res) => {
    const doctors = await Doctor.find({});
    res.render("admin/new", { doctors });
});

module.exports.postNewAppointment = async (req, res, next) => {
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
};

module.exports.showAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findById(id).populate("doctor");
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
};

module.exports.updateAppointment = CatchAsync(async (req, res) => {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndUpdate(id, {
        ...req.body,
    });
    req.flash("success", "Successfully Updated Appointment!");
    res.redirect(`/admin/appointments/${appointment._id}`);
});

module.exports.deleteAppointment = CatchAsync(async (req, res) => {
    const { id } = req.params;
    await Appointment.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted Appointment!");
    res.redirect("/admin/appointments");
});

module.exports.editAppointment = CatchAsync(async (req, res) => {
    const { id } = req.params;
    const appointment = await Appointment.findById(id).populate("doctor");
    const doctors = await Doctor.find({});
    res.render("admin/edit", { appointment, doctors });
});

module.exports.deletePatientAppointment = async (req, res) => {
    const { appointmentID, registrationID } = req.params;
    await Registrations.findByIdAndUpdate(registrationID, {
        cancelled: true,
        cancelled_at: new Date(),
    });

    req.flash("success", "You have cancelled an appointment!");
    res.redirect(`/admin/appointments/${appointmentID}`);
};
