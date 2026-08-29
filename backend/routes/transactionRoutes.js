const express = require("express");
const { createTransaction, getTransactions } = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getTransactions);
router.post("/", protect, createTransaction);

module.exports = router;
