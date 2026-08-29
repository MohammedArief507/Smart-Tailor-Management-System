const express = require("express");
const {
  getMeasurementsByCustomer,
  getMeasurementsByCategory,
  saveMeasurement,
} = require("../controllers/measurementController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// IMPORTANT: the /category/:category route must be declared before
// /:customerId, otherwise Express would treat "category" as a customer ID
router.get("/category/:category", protect, getMeasurementsByCategory);
router.get("/:customerId", protect, getMeasurementsByCustomer);
router.post("/", protect, saveMeasurement);

module.exports = router;
