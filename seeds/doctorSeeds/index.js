const mongoose = require("mongoose");
const connectDB = require("../../config/db");

const { firstname, surname, specialty } = require("./doctorNames");
const Doctor = require("../../models/doctors");

connectDB();

const seedDB = async () => {
    for (let i = 0; i < 10; i++) {
        const random = Math.floor(Math.random() * 100);
        const random12 = Math.floor(Math.random() * 12);
        const doctor = new Doctor({
            name: `${firstname[random]} ${surname[random]}`,
            specialty: `${specialty[random12]}`,
        });
        await doctor.save();
    }
    console.log("Doctors Updated");
};

seedDB().then(() => {
    mongoose.connection.close();
});
