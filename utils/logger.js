/**
 * Logger Utility (Production)
 * Logs only critical errors with timestamps and context.
 */

const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const errorLogPath = path.join(logDir, "errorlogs.txt");

/**
 * Silent chat logger (disabled for production)
 * Used only for debugging during development.
 */
exports.logChat = () => {
  // Disabled in production to prevent message logging
};

/**
 * Error logger — saves error details to file and console
 */
exports.logError = (context, error) => {
  const timestamp = new Date().toISOString();
  const log = `[${timestamp}] ❌ ERROR in ${context}: ${error.message}\n${error.stack}\n\n`;

  // Append to file
  fs.appendFile(errorLogPath, log, (err) => {
    if (err) console.error("⚠️ Failed to write error log:", err);
  });

  // Minimal console output
  console.error(
    `🚨 [${timestamp}] ERROR in ${context}: ${error.message}`
  );
};
