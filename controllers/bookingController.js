const Booking = require("../models/Booking");
const mongoose = require("mongoose");

// ======================
// Create Booking
// ======================
exports.createBooking = async (req, res) => {
    try {

        const {
            hallId,
            bookingDate,
            shift
        } = req.body;

        // Check whether this hall is already booked
        const alreadyBooked = await Booking.findOne({
            hallId,
            bookingDate,
            shift
        });

        if (alreadyBooked) {
            return res.status(400).json({
                message: "This hall is already booked for the selected date and shift."
            });
        }

        const booking = await Booking.find({
            userId: req.user.id,
            hallId,
            bookingDate,
            shift
        });

        res.status(201).json(booking);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// ======================
// Get User Bookings
// ======================
exports.getBookings = async (req, res) => {

    try {

        const bookings = await Booking.find({
            user: req.user.id
        });

        res.status(200).json(bookings);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

// ======================
// Delete Booking
// ======================
exports.deleteBooking = async (req, res) => {

    try {

        await Booking.findByIdAndDelete(req.params.id);

        res.json({
            message: "Booking Deleted"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

