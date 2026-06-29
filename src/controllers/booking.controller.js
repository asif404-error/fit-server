const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const getAllBookings = async (req, res, next) => {
  try {
    const db = getDB();
    const bookings = await db.collection("bookings").find({}).toArray();
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

const getBookingsByUser = async (req, res, next) => {
  try {
    const db = getDB();
    const bookings = await db
      .collection("bookings")
      .find({ userEmail: req.params.email })
      .toArray();
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

const checkBooking = async (req, res, next) => {
  try {
    const db = getDB();
    const { userEmail, classId } = req.query;
    const booking = await db
      .collection("bookings")
      .findOne({ userEmail, classId });
    res.json({ success: true, booked: !!booking });
  } catch (err) {
    next(err);
  }
};

const createBooking = async (req, res, next) => {
  try {
    const db = getDB();
    const { userEmail, classId } = req.body;

    const existing = await db.collection("bookings").findOne({ userEmail, classId });
    if (existing) {
      return res.status(400).json({ success: false, message: "You have already booked this class" });
    }

    const booking = { ...req.body, bookedAt: new Date() };
    const result = await db.collection("bookings").insertOne(booking);

    // Increment booking count on the class
    await db
      .collection("classes")
      .updateOne({ _id: new ObjectId(classId) }, { $inc: { bookingCount: 1 } });

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllBookings, getBookingsByUser, createBooking, checkBooking };