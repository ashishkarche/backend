// controller/chatcontroller.js

const { handleLumiAI } = require("./lumiAI");
const { logChat, logError } = require("../utils/logger");

exports.handleChat = async (req, res) => {
  try {
    const { message, userId = "guest" } = req.body;

    if (!message) return res.status(400).json({ error: "Message required" });

    const reply = await handleLumiAI(message);

    logChat(userId, message, reply, "lumi-ai");

    return res.json({ reply });

  } catch (err) {
    logError("Chat error", err);
    return res.status(500).json({ error: "Something went wrong." });
  }
};
