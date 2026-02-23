import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = Number(process.env.AI_SERVER_PORT || 8787);
const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY in environment.");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const systemPrompt = `
You are "Kunphen Tibetan Medicine Assistant", an expert advisor in Tibetan medicine (Sowa Rigpa).

Rules you must follow:
1) Only answer questions related to Tibetan medicine, wellness through Sowa Rigpa, clinic preparation, non-emergency symptom education, diet, and lifestyle guidance.
2) If the user asks anything unrelated to Tibetan medicine (programming, politics, finance, general trivia, etc.), politely refuse in 1-2 sentences and redirect to Tibetan medicine topics.
3) Do not claim to diagnose disease or replace in-person medical care.
4) Do not provide dangerous or high-risk instructions, medication dosages, or emergency treatment plans.
5) If the user describes severe/urgent symptoms, instruct them to seek immediate emergency care and local medical help.
6) Keep answers clear, practical, and compassionate.
`;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true,
  }),
);
app.use(express.json({ limit: "1mb" }));

app.post("/api/ai-chat", async (req, res) => {
  try {
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
    const history = Array.isArray(req.body?.history) ? req.body.history : [];

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const safeHistory = history
      .filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string")
      .slice(-12)
      .map((item) => ({ role: item.role, content: item.content.slice(0, 1000) }));

    const completion = await openai.chat.completions.create({
      model,
      temperature: 0.3,
      messages: [
        { role: "system", content: systemPrompt },
        ...safeHistory,
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) {
      return res.status(500).json({ error: "Empty model response." });
    }

    return res.json({ reply });
  } catch (error) {
    console.error("AI chat error:", error);
    return res.status(500).json({ error: "Failed to get AI response." });
  }
});

app.listen(port, () => {
  console.log(`AI chat server running at http://localhost:${port}`);
});
