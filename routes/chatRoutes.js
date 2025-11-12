const express = require("express");
const router = express.Router();
const { handleChat } = require("../controllers/chatController");
const apiLimiter = require("../utils/rateLimiter");

router.post("/", apiLimiter, handleChat);

module.exports = router;
