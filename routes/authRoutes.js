const express = require("express");
const router = express.Router();

const {
    sendOTP,
    resendOTP,
    verifyOTP,
    login
} = require("../controllers/authController");

// Authentication Routes
router.post("/sendOTP", sendOTP);
router.post("/resendOTP", resendOTP);
router.post("/verifyOTP", verifyOTP);
router.post("/login", login);

module.exports = router;