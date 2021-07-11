const mongoose = require("mongoose");
const Registration = require("./registrations");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    doctor: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: "Doctor", //refer to the Doctor model
    },
    description: {
        type: String,
        required: true,
    },
    registrantLimit: {
        type: Number,
        required: true,
    },
    registrations: [
        {
            type: Schema.Types.ObjectId,
            ref: "Registration",
        },
    ],
});

appointmentSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Registration.deleteMany({
            _id: {
                $in: doc.registrations,
            },
        });
    }
});

module.exports = mongoose.model("Appointment", appointmentSchema);
