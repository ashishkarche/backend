// Services/cohereService.js
const axios = require("axios");

const COHERE_API = "https://api.cohere.ai/v1";

/**
 * Generate text with Cohere LLM (recommended method)
 * @param {string} prompt - User prompt
 * @param {Object} options - LLM options
 */
async function generateLLM(
  prompt,
  { 
    max_tokens = 300, 
    temperature = 0.3,
    system = null 
  } = {}
) {
  try {
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt must be a valid string.");
    }

    const payload = {
      model: process.env.COHERE_LLM_MODEL || "command-r-plus",
      messages: [
        ...(system ? [{ role: "system", content: system }] : []),
        { role: "user", content: prompt }
      ],
      max_tokens,
      temperature,
    };

    const res = await axios.post(`${COHERE_API}/chat`, payload, {
      headers: {
        Authorization: `Bearer ${process.env.CO_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 12000,
    });

    const output = res.data?.text?.trim();

    return output || null;
  } catch (err) {
    console.error("❌ Cohere LLM Error:", err.response?.data || err.message);
    return null;
  }
}

module.exports = { generateLLM };
