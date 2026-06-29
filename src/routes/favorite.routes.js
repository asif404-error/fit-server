const express = require("express");
const router = express.Router();
const { verifyToken, checkBlocked } = require("../middleware/middleware");
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} = require("../controllers/favorite.controller");

router.get("/:email", verifyToken, getFavorites);
router.get("/check", verifyToken, checkFavorite);
router.post("/", verifyToken, checkBlocked, addFavorite);
router.delete("/", verifyToken, checkBlocked, removeFavorite);

module.exports = router;