require("dotenv").config();
const express = require("express");
const cors = require("cors");
const chatRoutes = require("./routes/chatRoutes");
const apiLimiter = require("./utils/rateLimiter");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Apply rate limiter to all API routes
app.use("/api", apiLimiter);

// Routes
app.use("/api/chat", chatRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("🤖 Ashish’s AI Assistant API is running successfully!");
});

// Export the app for Vercel serverless functions
module.exports = app;
