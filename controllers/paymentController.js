const razorpay = require("../config/razorpay");
const crypto = require("crypto");

// Create Order
exports.createOrder = async (req, res) => {
    try {
        const options = {
            amount: req.body.amount * 100,
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);

        res.json(order);
    } catch (err) {
        console.error("Payment Error:", err);

        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// Verify Payment
exports.verifyPayment = (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body)
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        return res.json({
            success: true,
            message: "Payment Verified Successfully",
        });
    }

    return res.status(400).json({
        success: false,
        message: "Payment Verification Failed",
    });
};