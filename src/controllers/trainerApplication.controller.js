const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const applyAsTrainer = async (req, res, next) => {
  try {
    const db = getDB();
    const { email } = req.body;

    const existing = await db
      .collection("trainerApplications")
      .findOne({ email });

    if (existing) {
      return res.status(400).json({ success: false, message: "Application already submitted" });
    }

    const application = {
      ...req.body,
      status: "pending",
      feedback: "",
      appliedAt: new Date(),
    };
    const result = await db.collection("trainerApplications").insertOne(application);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const getAllApplications = async (req, res, next) => {
  try {
    const db = getDB();
    const applications = await db
      .collection("trainerApplications")
      .find({ status: "pending" })
      .toArray();
    res.json({ success: true, data: applications });
  } catch (err) {
    next(err);
  }
};

const getApplicationByEmail = async (req, res, next) => {
  try {
    const db = getDB();
    const application = await db
      .collection("trainerApplications")
      .findOne({ email: req.params.email });
    res.json({ success: true, data: application });
  } catch (err) {
    next(err);
  }
};

const approveApplication = async (req, res, next) => {
  try {
    const db = getDB();
    const { email } = req.body;

    await db
      .collection("trainerApplications")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: { status: "approved" } });

    // Promote user role to trainer
    await db
      .collection("user")
      .updateOne({ email }, { $set: { role: "trainer" } });

    // In-app notification
    await db.collection("notifications").insertOne({
      userEmail: email,
      message: "Congratulations! Your trainer application has been approved.",
      read: false,
      createdAt: new Date(),
    });

    res.json({ success: true, message: "Trainer application approved" });
  } catch (err) {
    next(err);
  }
};

const rejectApplication = async (req, res, next) => {
  try {
    const db = getDB();
    const { email, feedback } = req.body;

    await db.collection("trainerApplications").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: "rejected", feedback } }
    );

    await db
      .collection("user")
      .updateOne({ email }, { $set: { status: "active" } });

    res.json({ success: true, message: "Trainer application rejected" });
  } catch (err) {
    next(err);
  }
};

const demoteTrainer = async (req, res, next) => {
  try {
    const db = getDB();
    await db
      .collection("user")
      .updateOne({ email: req.params.email }, { $set: { role: "user" } });

    await db
      .collection("trainerApplications")
      .updateOne({ email: req.params.email }, { $set: { status: "rejected" } });

    res.json({ success: true, message: "Trainer demoted to User successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  applyAsTrainer,
  getAllApplications,
  getApplicationByEmail,
  approveApplication,
  rejectApplication,
  demoteTrainer,
};