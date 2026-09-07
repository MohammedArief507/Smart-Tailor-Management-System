require("dotenv").config();
const dns = require("dns");

// Point Node directly at Google's DNS servers, and prefer IPv4 — together
// these fix "querySrv ECONNREFUSED" when connecting to MongoDB Atlas
// (mongodb+srv://...) on some Windows networks. Must run before anything
// that connects to MongoDB.
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const productRoutes = require("./routes/productRoutes");
const customerRoutes = require("./routes/customerRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const measurementRoutes = require("./routes/measurementRoutes");

const app = express();

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded product images statically (used in later modules)
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/measurements", measurementRoutes);

// Simple health check route
app.get("/", (req, res) => {
  res.send("Smart Tailor Management System API is running");
});

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Catches Multer errors (bad file type, file too large) and returns JSON instead of HTML
app.use((error, req, res, next) => {
  if (error) {
    return res.status(400).json({ message: error.message || "Upload failed" });
  }
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});