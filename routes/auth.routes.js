const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { 
    session: false,
    failureRedirect: "http://localhost:8080/login?error=auth_failed" 
  }),
  (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign(
        {
          id: req.user._id,
          email: req.user.email,
          name: req.user.name
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Redirect to frontend auth callback page with token
      res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
    } catch (error) {
      console.error("Error generating token:", error);
      res.redirect("http://localhost:5173/login?error=token_generation_failed");
    }
  }
);

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Get current user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.userId).select("-__v");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;