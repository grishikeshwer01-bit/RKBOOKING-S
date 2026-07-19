require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const receiptRoutes = require("./routes/receiptRoutes");
const hallRoutes=require("./routes/hallRoutes");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// 👇 ADD THESE 4 LINES HERE
app.use((req, res, next) => {
    console.log("Incoming:", req.method, req.originalUrl);
    next();
});

// Routes
console.log("authRoutes:", authRoutes);
console.log("bookingRoutes:", bookingRoutes);
console.log("paymentRoutes:", paymentRoutes);
console.log("receiptRoutes:", receiptRoutes);
console.log("hallRoutes:", hallRoutes);

app.use("/api/auth", authRoutes);
console.log("✅ auth loaded");

app.use("/api/booking", bookingRoutes);
console.log("✅ booking loaded");

app.use("/api/payment", paymentRoutes);
console.log("✅ payment loaded");

app.use("/api/receipt", receiptRoutes);
console.log("✅ receipt loaded");

app.use("/api/halls", hallRoutes);
console.log("✅ halls loaded");
// Test Route
app.get("/", (req, res) => {
    res.send("GK Event Backend Running");
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});