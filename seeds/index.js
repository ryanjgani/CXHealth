//adminSeed
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("../config/db");

const User = require("../models/users");

connectDB();

const seedDB = async () => {
    const newAdmin = new User({
        email: "admin@gmail.com",
        username: "admin",
        firstName: "admin",
        lastName: "admin",
        age: 10,
        password: "admin",
        role: "admin",
    });
    await newAdmin.save();
    console.log("Admin Updated");
};

seedDB().then(() => {
    mongoose.connection.close();
});
