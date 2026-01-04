import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("WARN: GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

// "gemini-2.0-flash-exp" is often the experimental endpoint for 2.0. 
// If specific 2.0 flash is not available widely yet as stable, we might fail back or use "gemini-1.5-flash". 
// However, user specifically asked for "Gemini 2.0 Flash". 
// I will try to use the model string 'gemini-2.0-flash-exp' which is common for the preview.
// If that fails, the user might need to adjust or I might need to swap to 1.5-flash.
// Text Model (Chat)
export const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp"
});

// JSON Model (Strict Structure)
export const jsonModel = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
        responseMimeType: "application/json"
    }
});
