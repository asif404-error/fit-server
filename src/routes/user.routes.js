const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/middleware");
const {
  getAllUsers,
  getUserByEmail,
  blockUser,
  unblockUser,
  makeAdmin,
} = require("../controllers/user.controller");

router.get("/", verifyToken, verifyAdmin, getAllUsers);
router.get("/:email", verifyToken, getUserByEmail);
router.patch("/block/:email", verifyToken, verifyAdmin, blockUser);
router.patch("/unblock/:email", verifyToken, verifyAdmin, unblockUser);
router.patch("/make-admin/:email", verifyToken, verifyAdmin, makeAdmin);

module.exports = router;