const jwt = require("jsonwebtoken");
const { getDB } = require("../config/db");
const { getAuth } = require("../config/auth");

// Verify JWT from HttpOnly cookie
const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // Fallback: try Better Auth session
    try {
      const auth = getAuth();
      const session = await auth.api.getSession({ headers: req.headers });
      if (!session?.user) {
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role || "user",
        status: session.user.status || "active",
      };
      next();
    } catch {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
  }
};

// Verify Admin role
const verifyAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden: Admins only" });
  }
  next();
};

// Verify Trainer role
const verifyTrainer = (req, res, next) => {
  if (req.user?.role !== "trainer" && req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden: Trainers only" });
  }
  next();
};

// Block check — blocked users cannot mutate data
const checkBlocked = async (req, res, next) => {
  try {
    const db = getDB();
    const user = await db
      .collection("users")
      .findOne({ email: req.user.email });

    if (user?.status === "blocked") {
      return res.status(403).json({
        success: false,
        message: "Action restricted by Admin",
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { verifyToken, verifyAdmin, verifyTrainer, checkBlocked };