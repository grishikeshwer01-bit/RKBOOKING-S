const User = require("../models/User");
const OTP = require("../models/Otp");

const transporter = require("../config/mail");
const sendSMS = require("../config/sms");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");

// ------------------------
// Signup (optional)
// ------------------------
    exports.sendOTP = async (req, res) => {
    try {

        const {
            fullName,
            email,
            mobile,
            password
        } = req.body;

        if (!fullName || !email || !mobile || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({
            $or: [
            
                { mobile },
                { email }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        await OTP.deleteMany({ email });

        const otp = otpGenerator.generate(6, {
            upperCase: false,
            lowerCaseAlphabets: false,
            specialChars: false,
            digits: true
        });

        await OTP.create({
            fullName,
            email,
            mobile,
            password,
            otp
        });
/*
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "GK Event OTP",
                text: `Your OTP is ${otp}`
            });
        } catch (err) {
            console.log(err.message);
        }

        try {
            await sendSMS(mobile, otp);
        } catch (err) {
            console.log(err.message);
        }
*/
        res.json({
            success: true,
            message: "OTP Sent",
            otp
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
;

// ------------------------
// Send OTP
// ------------------------
exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const otpData = await OTP.findOne({ mobile: req.body.mobile });

        if (!otpData) {
            return res.status(404).json({
                success: false,
                message: "Signup session expired"
            });
        }

        const otp = otpGenerator.generate(6, {
            upperCase: false,
            lowerCaseAlphabets: false,
            specialChars: false,
            digits: true
        });

        otpData.otp = otp;
        await otpData.save();
/*
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "GK Event OTP",
                text: `Your OTP is ${otp}`
            });
        } catch (err) {
            console.log("Email Error:", err.message);
        }

        try {
            await sendSMS(otpData.mobile, otp);
        } catch (err) {
            console.log("SMS Error:", err.message);
        }
*/
        res.json({
            success: true,
            message: "OTP Resent",
            otp: otp // For testing purposes, remove in production
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// ------------------------
// Verify OTP
// ------------------------
exports.verifyOTP = async (req, res) => {
     console.log("verifyOTP request:", req.body);
    try {

        const { mobile, otp } = req.body;

        const otpData = await OTP.findOne({
            mobile,
            otp
        });

        if (!otpData) {

            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });

        }

        const hashedPassword = await bcrypt.hash(
            otpData.password,
            10
        );

        const user = await User.create({

            fullName: otpData.fullName,

            email: otpData.email,

            mobile: otpData.mobile,

            password: hashedPassword,

            verified: true

        });

        await OTP.deleteOne({
            _id: otpData._id
        });

        const token = jwt.sign(

            {
                id: user._id
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );

        res.json({

            success: true,

            message: "Account Created Successfully",

            token

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};

// ------------------------
// Login
// ------------------------
exports.login = async (req, res) => {
    try {

        console.log("Request Body:", req.body);

        const { mobile, password } = req.body;

        console.log("Mobile:", mobile);

        const user = await User.findOne({ mobile });

        console.log("User Found:", user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Mobile number not registered"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        console.log("Password Match:", isMatch);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Password"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            message: "Login Successful",
            token
        });

    } catch (err) {
        console.log("LOGIN ERROR:", err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};