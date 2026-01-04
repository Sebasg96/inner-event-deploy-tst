const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function check() {
    console.log("--- 🔍 Starting System Check ---");

    // 1. Check PostgreSQL
    console.log("\n[1/3] Checking PostgreSQL Connection...");
    const prisma = new PrismaClient();
    try {
        await prisma.$connect();
        console.log("✅ Database Connection: SUCCESS");
        // Try a simple query
        const tenantCount = await prisma.tenant.count();
        console.log(`ℹ️  Tenants found: ${tenantCount}`);
    } catch (e) {
        console.error("❌ Database Connection: FAILED");
        console.error("   Error:", e.message);
        console.error("   Hint: Check DATABASE_URL in .env and ensure PostgreSQL is running.");
    } finally {
        await prisma.$disconnect();
    }

    // 2. Check Gemini
    console.log("\n[2/3] Checking Gemini API Key...");
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
        console.log("✅ API Key: PRESENT");
        // Optional: Simple model test?
        // Might consume quota, but ensures it works.
        // Let's verify the key format at least (not empty).
        if (apiKey.startsWith("AIza")) {
            console.log("✅ Key Format: LOOKS VALID (starts with AIza)");
        } else {
            console.log("⚠️  Key Format: UNUSUAL (does not start with AIza)");
        }
    } else {
        console.error("❌ API Key: MISSING (GEMINI_API_KEY not found in .env)");
    }

    console.log("\n[3/3] System Check Complete.");
    console.log("--------------------------------");
}

check();
