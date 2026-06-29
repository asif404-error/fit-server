const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const getAllPosts = async (req, res, next) => {
  try {
    const db = getDB();
    const { page = 1, limit = 9 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await db.collection("forumPosts").countDocuments();
    const posts = await db
      .collection("forumPosts")
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();
    res.json({ success: true, data: posts, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    next(err);
  }
};

const getLatestPosts = async (req, res, next) => {
  try {
    const db = getDB();
    const posts = await db
      .collection("forumPosts")
      .find({})
      .sort({ createdAt: -1 })
      .limit(4)
      .toArray();
    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
};

const getPostsByTrainer = async (req, res, next) => {
  try {
    const db = getDB();
    const posts = await db
      .collection("forumPosts")
      .find({ authorEmail: req.params.email })
      .sort({ createdAt: -1 })
      .toArray();
    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const db = getDB();
    const post = await db
      .collection("forumPosts")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

const createPost = async (req, res, next) => {
  try {
    const db = getDB();
    const post = {
      ...req.body,
      likes: [],
      dislikes: [],
      createdAt: new Date(),
    };
    const result = await db.collection("forumPosts").insertOne(post);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const db = getDB();
    await db.collection("forumPosts").deleteOne({ _id: new ObjectId(req.params.id) });
    await db.collection("comments").deleteMany({ postId: req.params.id });
    res.json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const likePost = async (req, res, next) => {
  try {
    const db = getDB();
    const { email } = req.body;
    const post = await db
      .collection("forumPosts")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (post.likes.includes(email)) {
      return res.status(400).json({ success: false, message: "Already liked" });
    }

    await db.collection("forumPosts").updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $addToSet: { likes: email },
        $pull: { dislikes: email },
      }
    );
    res.json({ success: true, message: "Post liked" });
  } catch (err) {
    next(err);
  }
};

const dislikePost = async (req, res, next) => {
  try {
    const db = getDB();
    const { email } = req.body;
    await db.collection("forumPosts").updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $addToSet: { dislikes: email },
        $pull: { likes: email },
      }
    );
    res.json({ success: true, message: "Post disliked" });
  } catch (err) {
    next(err);
  }
};

const getCommentsByPost = async (req, res, next) => {
  try {
    const db = getDB();
    const comments = await db
      .collection("comments")
      .find({ postId: req.params.id })
      .sort({ createdAt: 1 })
      .toArray();
    res.json({ success: true, data: comments });
  } catch (err) {
    next(err);
  }
};

const addComment = async (req, res, next) => {
  try {
    const db = getDB();
    const comment = {
      ...req.body,
      postId: req.params.id,
      createdAt: new Date(),
    };
    const result = await db.collection("comments").insertOne(comment);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const editComment = async (req, res, next) => {
  try {
    const db = getDB();
    await db
      .collection("comments")
      .updateOne(
        { _id: new ObjectId(req.params.commentId) },
        { $set: { content: req.body.content, updatedAt: new Date() } }
      );
    res.json({ success: true, message: "Comment updated" });
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const db = getDB();
    await db
      .collection("comments")
      .deleteOne({ _id: new ObjectId(req.params.commentId) });
    res.json({ success: true, message: "Comment deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
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
};