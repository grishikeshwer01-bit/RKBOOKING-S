const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    hallId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hall",
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    bookingDate: {
        type: Date,
        required: true
    },

    shift: {
        type: String,
        enum: ["Morning", "Afternoon", "Evening"],
        required: true
    }
}, {
    timestamps: true
});

bookingSchema.index(
    {
        hallId: 1,
        bookingDate: 1,
        shift: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model("Booking", bookingSchema);