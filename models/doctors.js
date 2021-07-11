const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    name: String,
    specialty: String,
    // patients: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Patient", //refer to the User model
    // },
});

module.exports = mongoose.model("Doctor", doctorSchema);
