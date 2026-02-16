
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "";

if (!API_KEY) {
    console.warn("GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateText(prompt: string, context: string = "") {
    try {
        const finalPrompt = `${context}\n\n${prompt}`;
        const result = await model.generateContent(finalPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error; // Throw so caller knows it failed
    }
}

export async function analyzeLead(leadData: any) {
    const prompt = `Analyze this healthcare practice for medical billing services fit:
    Practice: ${leadData.companyName}
    Website: ${leadData.website}
    Metadata: ${JSON.stringify(leadData.metadata || {})}
    
    Evaluate on the following criteria (1-10 scale each):
    1. BILLING COMPLEXITY (Multiple insurance payers, Medicaid/Medicare, wide service range)
    2. PRACTICE SIZE (1-5 providers = 10, perfect fit; 31+ providers = 2)
    3. PAIN POINT INDICATORS (Accepting new patients, no online bill pay, billing complaints)
    4. DECISION MAKER ACCESSIBILITY (DNP-owned = 10, direct email visible = 9)
    5. REVENUE POTENTIAL (Primary care + chronic disease = 9, specialty aesthetics = 10, cash-only = 3)

    Strict Qualification Criteria:
    - Must be PRIVATE (Not a hospital/government facility).
    - Favor DNP/NP-owned private practices.

    Return ONLY a JSON object:
    { 
      "status": "QUALIFIED" | "DISQUALIFIED", 
      "score": 0-100, 
      "category": "HOT" | "WARM" | "COLD",
      "reason": "Brief explanation",
      "painPoints": ["list of identified pains"],
      "recommendedApproach": "Personalization suggestion",
      "personalizationData": {
        "specialtyFocus": "extracted focus",
        "recentGrowth": "growth signal found"
      }
    }`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("Analysis Failed", e);
        return { status: "DISQUALIFIED", score: 0, reason: "AI Analysis Temporarily Unavailable" };
    }
}
