const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin, verifyTrainer, checkBlocked } = require("../middleware/middleware");
const {
  getAllPosts,
  getLatestPosts,
  getPostById,
  createPost,
  deletePost,
  likePost,
  dislikePost,
  getCommentsByPost,
  addComment,
  editComment,
  deleteComment,
  getPostsByTrainer,
} = require("../controllers/forum.controller");

router.get("/", getAllPosts);
router.get("/latest", getLatestPosts);
router.get("/trainer/:email", verifyToken, verifyTrainer, getPostsByTrainer);
router.get("/:id", verifyToken, getPostById);
router.post("/", verifyToken, verifyTrainer, createPost);
router.delete("/:id", verifyToken, deletePost);
router.patch("/:id/like", verifyToken, checkBlocked, likePost);
router.patch("/:id/dislike", verifyToken, checkBlocked, dislikePost);
router.get("/:id/comments", verifyToken, getCommentsByPost);
router.post("/:id/comments", verifyToken, checkBlocked, addComment);
router.put("/:id/comments/:commentId", verifyToken, checkBlocked, editComment);
router.delete("/:id/comments/:commentId", verifyToken, deleteComment);

module.exports = router;