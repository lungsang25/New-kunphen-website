export type AssistantRole = "user" | "assistant";

export interface AssistantMessage {
  role: AssistantRole;
  content: string;
}

interface ChatResponse {
  reply: string;
}

const API_URL = import.meta.env.VITE_AI_CHAT_API_URL || "/api/ai-chat";

export async function sendAssistantMessage(message: string, history: AssistantMessage[]): Promise<string> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      history,
    }),
  });

  if (!response.ok) {
    throw new Error("AI assistant is currently unavailable.");
  }

  const data = (await response.json()) as ChatResponse;
  if (!data.reply) {
    throw new Error("Invalid AI response.");
  }

  return data.reply;
}
