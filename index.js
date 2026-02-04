require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");

const connectDB = require("./config/db");
require("./config/passport");

const authRoutes = require("./routes/auth.routes");
const diseaseRoutes = require("./routes/disease.routes");

const app = express();

// Connect MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use("/auth", authRoutes);
app.use("/api/disease", diseaseRoutes);

// ✅ Backend health check (SAFE)
app.get("/api/health", (req, res) => {
  res.json({ status: "Krishi Care API running 🚜" });
});

// ❌ REMOVE ROOT ROUTE (VERY IMPORTANT)
// app.get("/", (req, res) => {
//   res.send("Krishi Care Backend Running 🚜");
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
