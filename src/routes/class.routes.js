const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin, verifyTrainer } = require("../middleware/middleware");
const {
  getAllClasses,
  getApprovedClasses,
  getFeaturedClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  approveClass,
  rejectClass,
  getClassesByTrainer,
  getClassAttendees,
} = require("../controllers/class.controller");

router.get("/", verifyToken, verifyAdmin, getAllClasses);
router.get("/approved", getApprovedClasses);
router.get("/featured", getFeaturedClasses);
router.get("/trainer/:email", verifyToken, verifyTrainer, getClassesByTrainer);
router.get("/:id", verifyToken, getClassById);
router.get("/:id/attendees", verifyToken, verifyTrainer, getClassAttendees);
router.post("/", verifyToken, verifyTrainer, createClass);
router.put("/:id", verifyToken, verifyTrainer, updateClass);
router.delete("/:id", verifyToken, deleteClass);
router.patch("/:id/approve", verifyToken, verifyAdmin, approveClass);
router.patch("/:id/reject", verifyToken, verifyAdmin, rejectClass);

module.exports = router;