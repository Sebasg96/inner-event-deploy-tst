const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Fallback to stable 1.5 flash
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
});

async function run() {
    console.log("🚀 Testing Gemini 1.5 Flash (fallback)...");
    try {
        const result = await model.generateContent('{"q": "Status Check", "answer": "OK"}');
        const response = await result.response;
        console.log("\n✅ Response received from Gemini 1.5 Flash:");
        console.log(response.text());
    } catch (error) {
        console.error("\n❌ Error connecting to Gemini 1.5 Flash:");
        console.error(error.message);
    }
}

run();
