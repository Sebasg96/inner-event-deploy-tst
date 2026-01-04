const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ NO API KEY FOUND");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: { responseMimeType: "application/json" }
});

async function run() {
    console.log("🚀 Testing Gemini 2.0 Flash (gemini-2.0-flash-exp)...");
    try {
        const result = await model.generateContent('{"q": "Hello, are you functional?", "answer": "Yes"}');
        const response = await result.response;
        console.log("\n✅ Response received from Gemini 2.0 Flash:");
        console.log(response.text());
    } catch (error) {
        console.error("\n❌ Error connecting to Gemini 2.0 Flash:");
        console.error(error.message);
        if (error.message.includes("404") || error.message.includes("not found")) {
            console.log("\n⚠️  Possible Issue: The model 'gemini-2.0-flash-exp' might not be enabled for your key or region.");
            console.log("    Try changing to 'gemini-1.5-flash' if this persists.");
        }
    }
}

run();
