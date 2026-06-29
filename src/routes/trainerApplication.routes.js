const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin, checkBlocked } = require("../middleware/middleware");
const {
  applyAsTrainer,
  getAllApplications,
  getApplicationByEmail,
  approveApplication,
  rejectApplication,
  demoteTrainer,
} = require("../controllers/trainerApplication.controller");

router.post("/", verifyToken, checkBlocked, applyAsTrainer);
router.get("/", verifyToken, verifyAdmin, getAllApplications);
router.get("/:email", verifyToken, getApplicationByEmail);
router.patch("/:id/approve", verifyToken, verifyAdmin, approveApplication);
router.patch("/:id/reject", verifyToken, verifyAdmin, rejectApplication);
router.patch("/demote/:email", verifyToken, verifyAdmin, demoteTrainer);

module.exports = router;