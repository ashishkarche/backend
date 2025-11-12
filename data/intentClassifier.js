/**
 * Intent Classifier for Nova AI
 * Uses Naive Bayes classifier + keyword fallback for reliability
 */

const natural = require("natural");
const { replies } = require("./replies");

const classifier = new natural.BayesClassifier();

// 🧠 Training Data
const trainingData = [
  ["hi", "greeting"], ["hello", "greeting"], ["hey", "greeting"],
  ["good morning", "greeting"], ["good evening", "greeting"],
  ["project", "projects"], ["projects", "projects"], ["portfolio", "projects"],
  ["skills", "skills"], ["technologies", "skills"], ["frontend", "skills"],
  ["experience", "experience"], ["career", "experience"],
  ["contact", "contact"], ["email", "contact"], ["reach out", "contact"],
  ["about", "about"], ["who are you", "about"], ["ashish", "about"],
  ["education", "education"], ["college", "education"], ["study", "education"],
  ["github", "social"], ["linkedin", "social"], ["profile", "social"],
];

trainingData.forEach(([text, label]) => classifier.addDocument(text, label));
classifier.train();

// 🔍 Keyword fallback
const keywordMap = {
  greeting: ["hi", "hello", "hey", "morning", "evening"],
  projects: ["project", "portfolio", "work", "app", "website"],
  skills: ["skill", "stack", "tech", "tools", "framework", "language"],
  experience: ["experience", "career", "background", "job"],
  contact: ["contact", "email", "reach", "connect", "phone"],
  about: ["about", "yourself", "ashish", "developer"],
  education: ["education", "college", "degree", "study", "university"],
  social: ["github", "linkedin", "portfolio", "profile", "social"],
};

// 🔁 Reply rotation tracker
const replyIndexTracker = {};

function getNextReply(intent) {
  const list = replies[intent] || replies.unknown;
  if (!replyIndexTracker[intent]) replyIndexTracker[intent] = 0;

  const reply = list[replyIndexTracker[intent]];
  replyIndexTracker[intent] = (replyIndexTracker[intent] + 1) % list.length;

  return reply;
}

/**
 * Classify message intent and get best matching reply
 */
module.exports.classifyMessage = (text) => {
  try {
    if (!text || typeof text !== "string") return replies.unknown[0];
    const input = text.toLowerCase().trim();

    const classifications = classifier.getClassifications(input);
    const top = classifications[0];

    // Keyword intent fallback
    let keywordIntent = null;
    for (const [intent, keywords] of Object.entries(keywordMap)) {
      if (keywords.some((kw) => input.includes(kw))) {
        keywordIntent = intent;
        break;
      }
    }

    // Confidence threshold
    let intent = top?.value > 0.6 ? top.label : keywordIntent || top.label;
    if (!replies[intent]) intent = "unknown";

    return getNextReply(intent);
  } catch (err) {
    console.error("❌ Error in classifyMessage:", err.message);
    return replies.unknown[0];
  }
};
