const express = require("express");
const router = express.Router();

const receiptController = require("../controllers/receiptController");
console.log(receiptController);
// Download Receipt
router.get("/:id", receiptController.downloadReceipt);

module.exports = router;