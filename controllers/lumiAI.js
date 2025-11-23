//controller/lumiAI.js
const { createEmbedding } = require("../Services/embeddingService");
const { chatLLM } = require("../Services/aiService");
const { queryPinecone } = require("../Services/pineconeService");

async function handleLumiAI(text) {
    try {
        const emb = await createEmbedding(text);
        if (!emb) throw new Error("Embedding failed");

        const results = await queryPinecone(emb);

        const context = results
            .map(r => r.metadata?.text || "")
            .join("\n");

        const prompt = `
You are Lumi, a professional AI assistant for Ashish.
Use the data below to answer clearly.

Context:
${context}

User Question:
${text}
        `;

        return await chatLLM(prompt);

    } catch (err) {
        console.error("Chat error:", err);

        return await chatLLM(
            `User says: "${text}". Give a helpful and polite answer.`
        );
    }
}

module.exports = { handleLumiAI };
