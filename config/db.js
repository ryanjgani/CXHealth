const mongoose = require("mongoose");

const connectDB = async () => {
    mongoose.connect(
        `mongodb+srv://ryan:${process.env.MONGO_KEY}@health.lza9w.mongodb.net/Health?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        }
    );

    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => {
        console.log("Mongo Database Atlas connected");
    });
};
module.exports = connectDB;
