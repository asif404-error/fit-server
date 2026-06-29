const { getDB } = require("../config/db");

const getAllUsers = async (req, res, next) => {
  try {
    const db = getDB();
    const users = await db.collection("user").find({}).toArray();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

const getUserByEmail = async (req, res, next) => {
  try {
    const db = getDB();
    const user = await db
      .collection("user")
      .findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const blockUser = async (req, res, next) => {
  try {
    const db = getDB();
    await db
      .collection("user")
      .updateOne({ email: req.params.email }, { $set: { status: "blocked" } });
    res.json({ success: true, message: "User blocked successfully" });
  } catch (err) {
    next(err);
  }
};

const unblockUser = async (req, res, next) => {
  try {
    const db = getDB();
    await db
      .collection("user")
      .updateOne({ email: req.params.email }, { $set: { status: "active" } });
    res.json({ success: true, message: "User unblocked successfully" });
  } catch (err) {
    next(err);
  }
};

const makeAdmin = async (req, res, next) => {
  try {
    const db = getDB();
    await db
      .collection("user")
      .updateOne({ email: req.params.email }, { $set: { role: "admin" } });
    res.json({ success: true, message: "User promoted to Admin successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, getUserByEmail, blockUser, unblockUser, makeAdmin };