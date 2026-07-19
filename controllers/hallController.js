const Hall = require("../models/Hall");
const Booking = require("../models/Booking");

// Get all halls
exports.getHalls = async (req, res) => {
    try {
        const halls = await Hall.find();
        res.json(halls);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Get available halls
exports.getAvailableHalls = async (req, res) => {
    try {
        const {
            state,
            district,
            mandal,
            bookingDate,
            shift
        } = req.query;

        const booked = await Booking.find({
            bookingDate,
            shift
        });

        const bookedIds = booked.map(item => item.hallId);

        const halls = await Hall.find({
            state,
            district,
            mandal,
            _id: { $nin: bookedIds }
        });

        res.json(halls);

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};