const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const getAllClasses = async (req, res, next) => {
  try {
    const db = getDB();
    const classes = await db.collection("classes").find({}).toArray();
    res.json({ success: true, data: classes });
  } catch (err) {
    next(err);
  }
};

const getApprovedClasses = async (req, res, next) => {
  try {
    const db = getDB();
    const { search, category, page = 1, limit = 9 } = req.query;
    const query = { status: "approved" };

    if (search) query.className = { $regex: search, $options: "i" };
    if (category) query.category = { $in: category.split(",") };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await db.collection("classes").countDocuments(query);
    const classes = await db
      .collection("classes")
      .find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    res.json({ success: true, data: classes, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    next(err);
  }
};

const getFeaturedClasses = async (req, res, next) => {
  try {
    const db = getDB();
    const classes = await db
      .collection("classes")
      .find({ status: "approved" })
      .sort({ bookingCount: -1 })
      .limit(6)
      .toArray();
    res.json({ success: true, data: classes });
  } catch (err) {
    next(err);
  }
};

const getClassById = async (req, res, next) => {
  try {
    const db = getDB();
    const cls = await db
      .collection("classes")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!cls) return res.status(404).json({ success: false, message: "Class not found" });
    res.json({ success: true, data: cls });
  } catch (err) {
    next(err);
  }
};

const getClassesByTrainer = async (req, res, next) => {
  try {
    const db = getDB();
    const classes = await db
      .collection("classes")
      .find({ trainerEmail: req.params.email })
      .toArray();
    res.json({ success: true, data: classes });
  } catch (err) {
    next(err);
  }
};

const getClassAttendees = async (req, res, next) => {
  try {
    const db = getDB();
    const bookings = await db
      .collection("bookings")
      .find({ classId: req.params.id })
      .toArray();
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

const createClass = async (req, res, next) => {
  try {
    const db = getDB();
    const newClass = {
      ...req.body,
      status: "pending",
      bookingCount: 0,
      createdAt: new Date(),
    };
    const result = await db.collection("classes").insertOne(newClass);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const updateClass = async (req, res, next) => {
  try {
    const db = getDB();
    const result = await db
      .collection("classes")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const deleteClass = async (req, res, next) => {
  try {
    const db = getDB();
    await db.collection("classes").deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true, message: "Class deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const approveClass = async (req, res, next) => {
  try {
    const db = getDB();
    await db
      .collection("classes")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: { status: "approved" } });
    res.json({ success: true, message: "Class approved successfully" });
  } catch (err) {
    next(err);
  }
};

const rejectClass = async (req, res, next) => {
  try {
    const db = getDB();
    await db
      .collection("classes")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: { status: "rejected" } });
    res.json({ success: true, message: "Class rejected successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
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
};