const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const { getAuth } = require("./config/auth");
const { toNodeHandler } = require("better-auth/node");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const classRoutes = require("./routes/class.routes");
const bookingRoutes = require("./routes/booking.routes");
const forumRoutes = require("./routes/forum.routes");
const paymentRoutes = require("./routes/payment.routes");
const trainerApplicationRoutes = require("./routes/trainerApplication.routes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(cookieParser());

// Better Auth handler (must be before express.json())
app.all("/api/auth/*splat", (req, res) => {
  const auth = getAuth();
  return toNodeHandler(auth)(req, res);
});

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/trainer-applications", trainerApplicationRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("FitNexus Server is running ✅");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

start();