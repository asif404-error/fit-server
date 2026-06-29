const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const getNotifications = async (req, res, next) => {
  try {
    const db = getDB();
    const notifications = await db
      .collection("notifications")
      .find({ userEmail: req.params.email })
      .sort({ createdAt: -1 })
      .toArray();
    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const db = getDB();
    await db
      .collection("notifications")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: { read: true } });
    res.json({ success: true, message: "Notification marked as read" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getNotifications, markAsRead };