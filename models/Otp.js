const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({

    email: String,

    mobile: String,

    otp: String,

    fullName: String,

    password: String,

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }

});

module.exports = mongoose.model("Otp", otpSchema);