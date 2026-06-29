const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/middleware");
const {
  getNotifications,
  markAsRead,
} = require("../controllers/notification.controller");

router.get("/:email", verifyToken, getNotifications);
router.patch("/:id/read", verifyToken, markAsRead);

module.exports = router;