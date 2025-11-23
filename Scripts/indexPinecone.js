//Scripts/indexPinecone.js

require("dotenv").config();
const { Pinecone } = require("@pinecone-database/pinecone");
const { createEmbedding } = require("../Services/embeddingService");

// -----------------------------
// INIT PINECONE
// -----------------------------
if (!process.env.PINECONE_API_KEY) {
  console.error("❌ Missing PINECONE_API_KEY");
  process.exit(1);
}

if (!process.env.PINECONE_INDEX) {
  console.error("❌ Missing PINECONE_INDEX");
  process.exit(1);
}

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

// must use namespace OR default
const index = pc.index(process.env.PINECONE_INDEX).namespace("lumi");

// -----------------------------
// DOCUMENTS
// -----------------------------
const docs = [
  {
    id: "project-1",
    text: "ChotuLink is a modern URL shortener with QR code generation and analytics tracking.",
  },
  {
    id: "project-2",
    text: "Structural Audit System is a workflow automation tool for engineers.",
  },
  {
    id: "project-3",
    text: "DiseasePredict uses machine learning to predict medical risks.",
  },
  {
    id: "about-ashish",
    text: "Ashish is a full-stack developer skilled in React, Node.js, Express, PostgreSQL, Docker, and modern UI/UX.",
  },
];

// -----------------------------
// SAFE UPSERT
// -----------------------------
async function safeUpsert(vectors) {
  if (!vectors || vectors.length === 0) {
    console.log("⚠ No vectors to upsert — skipping.");
    return;
  }

  try {
    console.log(`📌 Upserting ${vectors.length} vectors...`);

    await index.upsert(vectors); // Pinecone v3 accepts array directly

    console.log("✅ Vectors inserted successfully.");
  } catch (err) {
    console.error("❌ Upsert failed:", err?.response?.data || err.message);
  }
}

// -----------------------------
// MAIN RUN FUNCTION
// -----------------------------
async function run() {
  console.log("➡ Generating embeddings using Cohere…");

  const vectors = [];

  for (const doc of docs) {
    try {
      const emb = await createEmbedding(doc.text);

      if (!emb || emb.length === 0) {
        console.log(`⚠ Skipping "${doc.id}" — embedding empty.`);
        continue;
      }

      vectors.push({
        id: doc.id,
        values: emb,
        metadata: { text: doc.text },
      });

      console.log(`✔ Embedded: ${doc.id}`);
    } catch (err) {
      console.error(`❌ Failed embedding for ${doc.id}:`, err.message);
    }
  }

  await safeUpsert(vectors);
  console.log("🎉 All done!");
}

run();
