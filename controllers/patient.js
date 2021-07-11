const Appointment = require("../models/appointments");
const Registration = require("../models/registrations");

module.exports.getAppointment = async (req, res) => {
    const appointments = await Appointment.find({}).populate("doctor");
    res.render("patient/index", { appointments });
};

module.exports.myAppointments = async (req, res) => {
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
};

module.exports.showAppointment = async (req, res) => {
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
};

module.exports.registerAppointment = async (req, res) => {
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
};

module.exports.cancelAppointment = async (req, res) => {
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
};
