const { CohereClient } = require("cohere-ai");
require("dotenv").config();

const cohere = new CohereClient({
  apiKey: process.env.CO_API_KEY
});

async function chatLLM(userPrompt) {
  const resumeMeta = `
  Candidate Name: Ashish Karche  
Location: Pune, Dhanori  
Email: ashishkarche9@gmail.com  
Phone: +91 74988 11353  
Portfolio: portfolio-plum-alpha-60.vercel.app  
LinkedIn: linkedin.com/in/ashish-karche  
GitHub: github.com/ashishkarche  

Education:  
- BE in Computer Engineering, Ajeenkya D.Y. Patil School Of Engineering  
  Duration: May 2020 – May 2024  

Experience:  

1. Web Developer Intern — CodeNucleus, Pune (Feb 2025 – Apr 2025)  
   - Built interactive UI components: dynamic tables, preview modals, form validations  
   - Improved user workflow efficiency by 40%  
   - Optimized API endpoints and database queries, reducing data fetch time by 30%  
   - Enhanced overall application responsiveness  

2. Web Developer Intern — Let’s Grow More, Pune (Mar 2023 – Apr 2023)  
   - Applied responsive design principles  
   - Delivered clean, mobile-friendly UI components  
   - Worked with project planning, component architecture, and state management in React  
   - Developed a fully responsive registration form with client-side validation  

Projects:  

1. ChotuLink 2  
   - URL shortening application with click tracking + QR generation  
   - Tools: React.js, Node.js, PostgreSQL, Express  

2. Structural Audit Management System  
   - System for drawing uploads, structural observations, NDT tests, report generation  
   - Tools: React.js, Node.js, PostgreSQL  

3. Disease Prediction Site  
   - AI-powered risk prediction system using symptoms, history, and lifestyle  
   - Includes secure authentication + report generation  
   - Tools: React.js, Node.js, PostgreSQL, Python, RESTful API  

Technical Skills:  
- Languages: Java, SQL, JavaScript, HTML, CSS  
- Frameworks: React.js, Node.js, Express.js  
- Tools: Git, Docker, Postman, NPM, Vite, MS SQL Server  
- Concepts: OOP, DSA, OS, DBMS, Computer Networks, DOM, JSON  
- Databases: PostgreSQL, MySQL  

  `;

  const prompt = `
You are a professional AI assistant. Use the following resume context to answer clearly and professionally.

Resume Metadata:
${resumeMeta}

User Query:
${userPrompt}

Your Response (professional, concise):
`;

  const response = await cohere.chat({
    model: process.env.COHERE_LLM_MODEL || "command",
    message: prompt
  });

  return (
    response.message?.content?.[0]?.text ||
    response.text ||
    "No response."
  );
}

module.exports = { chatLLM };
