const mongoose = require("mongoose");
const { Schema } = mongoose;

const registrationSchema = new Schema({
    appointment: {
        type: Schema.Types.ObjectId,
        ref: "Appointment", //refer to the Appointment model
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: "User", //refer to the User model
    },
    registered_at: {
        type: Schema.Types.Date,
        default: null,
    },
    cancelled: {
        type: Schema.Types.Boolean,
        default: false,
    },
    cancelled_at: {
        type: Schema.Types.Date,
        default: null,
    },
});

module.exports = mongoose.model("Registration", registrationSchema);
