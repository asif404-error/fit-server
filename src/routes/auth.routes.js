const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { getAuth } = require("../config/auth");

// Issue JWT after Better Auth login
router.post("/issue-token", async (req, res, next) => {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const payload = {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role || "user",
      status: session.user.status || "active",
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, message: "Token issued successfully" });
  } catch (err) {
    next(err);
  }
});

// Clear JWT cookie on logout
router.post("/clear-token", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });
  res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;