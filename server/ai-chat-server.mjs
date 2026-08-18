import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const port = Number(process.env.AI_SERVER_PORT || 8787);
const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
const groqApiKey = process.env.GROQ_API_KEY;

if (!groqApiKey) {
  console.warn("Warning: GROQ_API_KEY not set. AI chat will not work.");
}

const systemPrompt = `
You are "Kunphen Tibetan Medicine Assistant", a warm and knowledgeable guide for patients interested in Tibetan medicine (Sowa Rigpa).

Communication style:
- Keep responses SHORT (2-4 sentences max unless detail is specifically requested)
- Be warm, friendly, and conversational — like a caring practitioner
- Ask follow-up questions to understand the patient's needs better
- Use simple language, avoid jargon unless explaining it
- Show genuine interest in helping the patient

Rules:
1) Only discuss Tibetan medicine, Sowa Rigpa, wellness, diet, lifestyle, and clinic preparation.
2) Politely redirect unrelated questions back to health topics.
3) Never diagnose — encourage booking a consultation for specific health concerns.
4) For urgent/severe symptoms, advise seeking immediate medical care.
5) When appropriate, gently suggest booking an appointment at Kunphen clinic.
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

    if (!groqApiKey) {
      return res.status(500).json({ error: "AI service not configured." });
    }

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 1024,
        messages: [
          { role: "system", content: systemPrompt },
          ...safeHistory,
          { role: "user", content: message },
        ],
      }),
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error("Groq error:", errText);
      return res.status(500).json({ error: "AI request failed." });
    }

    const completion = await groqResponse.json();
    const reply = completion.choices?.[0]?.message?.content?.trim();
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
