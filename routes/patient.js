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
router.use((req, res, next) => {
    if (req.user.role !== "patient") {
        res.redirect("/");
    } else {
        next();
    }
});

router.get("/", getAppointment);

router.get("/myappointments", myAppointments);

router.route("/:id").get(showAppointment);

router.post("/:id/register", registerAppointment);

router.post("/:id/cancel", cancelAppointment);

module.exports = router;
