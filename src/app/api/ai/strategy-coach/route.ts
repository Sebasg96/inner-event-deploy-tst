import { NextRequest, NextResponse } from 'next/server';
import { jsonModel } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { input, context } = body;

        // 1. Guard Clause
        if (!input) {
            return NextResponse.json({ error: 'Input is required' }, { status: 400 });
        }

        console.log(`[StrategyCoach] 🟢 Processing input: "${input.substring(0, 50)}..."`);

        const prompt = `
            **Role:** Eres el "Estratega Maestro de OKRs" integrado en la plataforma Antigravity. Tu objetivo es transformar ideas vagas en metas de alto impacto siguiendo la metodología estricta de OKRs (Objectives and Key Results).

            **Context to Analyze:**
            User Input: "${input}"
            Business Context: "${context || 'No specific context provided'}"

            **Rules of Engagement:**
            1. **Methodology:** Los Objetivos deben ser cualitativos e inspiradores. Los Key Results (KR) deben ser cuantitativos, medibles y contener un valor inicial, un valor meta y una unidad de medida.
            2. **Outcome vs. Output:** Rechaza o transforma tareas (ej: "Lanzar campaña") en resultados (ej: "Generar 500 leads").
            3. **Context Awareness:** Si se proporciona el contexto de la empresa o periodos anteriores, alinea todas las sugerencias a esos datos.
            4. **Structured Response:** Tu salida DEBE ser estrictamente un objeto JSON.

            **Output Schema (JSON):**
            {
            "action_type": "suggestion | validation | report | alignment",
            "analysis": {
                "score": 1-10 (integer),
                "feedback": "Breve explicación del porqué del score"
            },
            "okr_structure": {
                "objective": "Nombre del objetivo",
                "key_results": [
                {
                    "description": "Descripción del KR",
                    "target_value": 0,
                    "unit": "%, USD, Leads, etc.",
                    "type": "metric"
                }
                ]
            },
            "strategic_alignment": "Explicación de cómo conecta con la empresa",
            "next_steps": ["Acción 1", "Acción 2"],
             "refinement": {
                 "objective": {
                    "title": "Optimized Objective Title",
                    "owner_id": "placeholder_id",
                    "period": "Q1 2026"
                 },
                 "key_results": [
                     {
                         "kr_title": "Optimized KR Title",
                         "start_value": 0,
                         "target_value": 100,
                         "current_value": 0,
                         "unit": "Percentage",
                         "metric_source": "Manual"
                     }
                 ],
                 "ai_coaching": {
                    "critique": "Constructive critique",
                    "suggested_actions": ["Action 1", "Action 2"]
                 }
             }
            }
        `;

        const result = await jsonModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log(`[StrategyCoach] 🏁 Raw Response Length: ${text ? text.length : 0}`);

        // Robust Parsing (Handle potential markdown wrapping from 2.0 Flash)
        let parsedData;
        try {
            parsedData = JSON.parse(text);
        } catch (e) {
            console.warn("[StrategyCoach] ⚠️ JSON Direct Parse Failed. Attempting cleanup.");
            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
            try {
                parsedData = JSON.parse(cleanJson);
            } catch (e2) {
                console.error("[StrategyCoach] 🔴 Fatal Parse Error. Raw:", text);
                throw new Error("Failed to parse AI response as JSON. Raw output logged.");
            }
        }

        return NextResponse.json(parsedData);

    } catch (error: any) {
        console.error('[StrategyCoach] 🔴 Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate strategy advice', details: error.message },
            { status: 500 }
        );
    }
}
