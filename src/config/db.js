const dotenv = require("dotenv");
dotenv.config();

const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI;

let db;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const connectDB = async () => {
  try {
    await client.connect();
    db = client.db(process.env.DB_NAME);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) throw new Error("DB not initialized. Call connectDB first.");
  return db;
};

module.exports = { connectDB, getDB };