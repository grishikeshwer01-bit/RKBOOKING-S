const router = require("express").Router();

const bookingController = require("../controllers/bookingController");
const auth = require("../middleware/auth");

router.post("/", auth, bookingController.createBooking);

router.get("/", auth, bookingController.getBookings);

router.delete("/:id", auth, bookingController.deleteBooking);

module.exports = router;