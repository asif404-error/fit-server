const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin, checkBlocked } = require("../middleware/middleware");
const {
  getAllBookings,
  getBookingsByUser,
  createBooking,
  checkBooking,
} = require("../controllers/booking.controller");

router.get("/", verifyToken, verifyAdmin, getAllBookings);
router.get("/user/:email", verifyToken, getBookingsByUser);
router.get("/check", verifyToken, checkBooking);
router.post("/", verifyToken, checkBlocked, createBooking);

module.exports = router;