// Services/embeddingService.js
const { CohereClient } = require("cohere-ai");
require("dotenv").config();

const cohere = new CohereClient({
  apiKey: process.env.COHERE_API_KEY
});

async function createEmbedding(text) {
  try {
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      throw new Error("Invalid text for embedding.");
    }

    const response = await cohere.embed({
      model: process.env.COHERE_EMBED_MODEL || "embed-multilingual-v3.0",
      texts: [text],
      input_type: "search_document"
    });

    const embedding = response.embeddings?.[0];

    if (!embedding) {
      throw new Error("Empty embedding received.");
    }

    return embedding;

  } catch (err) {
    console.error("❌ Embedding Error:", err.response?.data || err.message);
    return null;
  }
}

module.exports = { createEmbedding };
