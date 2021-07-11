const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "patient"],
        required: true,
    },
});

//creates password field
userSchema.plugin(passportLocalMongoose);

// fire a function before doc saved to db
userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// static method to login user
userSchema.statics.login = async function (username, password) {
    const user = await this.findOne({ username });
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
        return user;
    } else {
        throw Error("Wrong Username or Password");
    }
};

module.exports = mongoose.model("User", userSchema);
