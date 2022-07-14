const express = require("express");
const ROUTER = express.Router();
const userRoutes = require("./userRoutes");
const tripRoutes = require("./tripRoutes");
const authRoutes = require("./authRoutes");
const recomendationRoutes = require("./recomendationRouter");
const adminRoutes = require("./adminRouter");
const verifyToken = require("../middleware/verifyToken");

ROUTER.use("/user", verifyToken, userRoutes);
ROUTER.use("/trip", tripRoutes);
ROUTER.use(authRoutes);
ROUTER.use("/recomendation", recomendationRoutes);
ROUTER.use("/admin", verifyToken, adminRoutes);

ROUTER.all("*", (req, res, next) => {
  res.status(404).json({
    error: 404,
    message: `Request URL ${req.path} Not Found`,
  });
});

ROUTER.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: statusCode,
    message: err.message,
  });
});

module.exports = ROUTER;
