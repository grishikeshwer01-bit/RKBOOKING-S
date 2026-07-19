const express = require("express");
const router = express.Router();

const hallController = require("../controllers/hallController");

router.get("/available", hallController.getAvailableHalls);
console.log(hallController); // ✅ if you really want to log it

router.get("/", hallController.getHalls);

module.exports = router;