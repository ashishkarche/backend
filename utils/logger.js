// utils/logger.js
const chalk = require("chalk");

function timestamp() {
  return new Date().toISOString();
}

function logChat(userId, userText, replyText, source = "llm") {
  console.log(
    chalk.green(`[CHAT]`) +
      ` ${timestamp()} | user=${userId} | source=${source}\n` +
      chalk.cyan(`Q:`) +
      ` ${userText}\n` +
      chalk.yellow(`A length:`) +
      ` ${String(replyText || "").length}\n`
  );
}

function logError(message, err) {
  console.error(
    chalk.red(`[ERROR]`) +
      ` ${timestamp()} | ${message}\n` +
      (err?.stack || err)
  );
}

module.exports = { logChat, logError };
