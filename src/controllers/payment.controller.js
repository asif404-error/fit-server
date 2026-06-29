const { getDB } = require("../config/db");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
    });
    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (err) {
    next(err);
  }
};

const saveTransaction = async (req, res, next) => {
  try {
    const db = getDB();
    const transaction = {
      ...req.body,
      createdAt: new Date(),
    };
    const result = await db.collection("transactions").insertOne(transaction);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const getAllTransactions = async (req, res, next) => {
  try {
    const db = getDB();
    const transactions = await db
      .collection("transactions")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json({ success: true, data: transactions });
  } catch (err) {
    next(err);
  }
};

module.exports = { createPaymentIntent, saveTransaction, getAllTransactions };