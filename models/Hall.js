const mongoose = require("mongoose");

const hallSchema = new mongoose.Schema({
    name: String,
    state: String,
    district: String,
    mandal: String,
    location: String,
    image: String,
    map: String
});

module.exports = mongoose.model("Hall", hallSchema);