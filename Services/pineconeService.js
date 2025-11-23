// Services/pineconeService.js
require("dotenv").config();
const { Pinecone } = require("@pinecone-database/pinecone");

// -----------------------------
// VALIDATION
// -----------------------------
if (!process.env.PINECONE_API_KEY) {
  console.error("❌ Missing PINECONE_API_KEY");
  process.exit(1);
}

if (!process.env.PINECONE_INDEX) {
  console.error("❌ Missing PINECONE_INDEX");
  process.exit(1);
}

// -----------------------------
// INIT CLIENT
// -----------------------------
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// ⚠️ IMPORTANT — v3 uses `.index()` (not .Index)
const index = pc.index(process.env.PINECONE_INDEX);

// -----------------------------
// QUERY FUNCTION
// -----------------------------
async function queryPinecone(vector, topK = 5) {
  try {
    if (!vector || !Array.isArray(vector) || vector.length === 0) {
      console.log("⚠ Invalid or empty embedding vector.");
      return [];
    }

    const response = await index.query({
      vector,
      topK,
      includeMetadata: true,
    });

    return response.matches || [];

  } catch (err) {
    console.error("❌ Pinecone Query Error:", err?.response?.data || err.message);
    return [];
  }
}

module.exports = { queryPinecone };
