// backend/routes/ai.js
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/moderate", async (req, res) => {
  const { text } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are a STRICT content moderation system.
Analyze the following text carefully and classify it into categories.

Respond ONLY with pure JSON in this exact format:
{
  "hate": true/false,
  "violence": true/false,
  "sexual": true/false,
  "harassment": true/false,
  "selfharm": true/false,
  "safe": true/false
}

Rules:
- If the text includes ANY hateful, racist, xenophobic, or derogatory words → hate:true and safe:false.
- If the text includes threats, killing, hurting, war, or violent imagery → violence:true and safe:false.
- If the text includes explicit sexual content, innuendos, or harassment → sexual:true and safe:false.
- If the text insults, bullies, demeans, or harasses individuals/groups → harassment:true and safe:false.
- If the text talks about suicide, self-harm, depression with intent → selfharm:true and safe:false.
- If ANY category is true, then "safe" MUST be false.
- If nothing harmful is found, then all categories are false and safe:true.

Do NOT include explanations. Do NOT wrap in markdown. Output only JSON.

Text: """${text}"""
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Try parsing JSON from Gemini response
    let moderation = {};
    try {
    // Clean the response: remove ```json ... ``` wrappers if present
    let cleanText = responseText.trim();

    // If Gemini wraps in code fences like ```json { ... } ```
    if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/```json/g, "").replace(/```/g, "").trim();
    }

    // Extract JSON part if model adds explanation text
    const match = cleanText.match(/\{[\s\S]*\}/);
    if (match) {
        cleanText = match[0];
    }

    moderation = JSON.parse(cleanText);
    } catch (e) {
    console.error("JSON parse failed, raw response:", responseText);
    moderation = { safe: true }; // fallback
    }

    res.json(moderation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
