/**
 * Chat Controller
 * Handles incoming chat messages and returns AI responses
 */

const { classifyMessage } = require("../data/intentClassifier");
const { logChat, logError } = require("../utils/logger");

/**
 * POST /api/chat
 * Handles user messages and returns classified replies.
 */
exports.handleChat = async (req, res) => {
  try {
    const { message, userId = "guest" } = req.body;

    // 🧩 Validate input
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        status: 400,
        error: "⚠️ Invalid input. Message text is required.",
      });
    }

    // 🧠 Classify the *latest* message only
    const reply = classifyMessage(message.trim());

    // 🧾 Log the conversation
    logChat(userId, message, reply);

    // ✅ Success response
    return res.status(200).json({
      status: 200,
      reply,
    });
  } catch (err) {
    // ❌ Handle and log unexpected errors
    logError("Error in handleChat", err);

    return res.status(500).json({
      status: 500,
      error: "Internal Server Error. Please try again later.",
    });
  }
};
