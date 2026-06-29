const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin, checkBlocked } = require("../middleware/middleware");
const {
  createPaymentIntent,
  saveTransaction,
  getAllTransactions,
} = require("../controllers/payment.controller");

router.post("/create-intent", verifyToken, checkBlocked, createPaymentIntent);
router.post("/save", verifyToken, checkBlocked, saveTransaction);
router.get("/transactions", verifyToken, verifyAdmin, getAllTransactions);

module.exports = router;