import { NextRequest, NextResponse } from 'next/server';
import { model } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, context } = body;

        // 1. Guard Clause
        if (!message) {
            return NextResponse.json({ reply: "I need a message to respond to." }, { status: 400 });
        }

        console.log(`[PragmaIA] 🟢 Received Input: "${message.substring(0, 50)}..."`);

        const prompt = `
            You are PRAGM-IA, an advanced AI Strategy Assistant integrated into the "Antigravity" platform. 
            You appear as a holographic space companion.
            
            Current User Context: ${context || 'None'}
            User Message: "${message}"

            Style Guide:
            - Tone: Professional, futuristic, slightly witty, supportive.
            - Terminology: Use OKR terms correctly (Objective, Key Result, Initiative).
            - Keep responses concise (under 200 words unless asked for detail).
            - Use emojis sparingly (🪐, 🚀, ✨).
            
            Provide a helpful response.
        `;

        // 2. Timeout / API Call Protection
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 3. Log Raw Response
        console.log(`[PragmaIA] 🏁 Raw Response Length: ${text ? text.length : 0}`);
        // console.log(`[PragmaIA] Raw Response Preview: ${text.substring(0, 50)}...`);

        if (!text) {
            throw new Error("Empty response received from Gemini Model");
        }

        return NextResponse.json({ reply: text });

    } catch (error: any) {
        console.error("[PragmaIA] 🔴 Critical Error:", error);

        // 4. Detailed Error for Client
        const errorMessage = error.message || "Unknown error occurred";
        const isQuotaError = errorMessage.includes("429") || errorMessage.includes("Quota");

        return NextResponse.json({
            reply: isQuotaError
                ? "⚠️ My neural link is overloaded (Quota Exceeded). Please try again later."
                : `⚠️ Neural Link Error: ${errorMessage}`
        }, { status: 500 });
    }
}
