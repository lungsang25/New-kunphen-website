import { useMemo, useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { sendAssistantMessage, type AssistantMessage } from "@/lib/aiAssistant";

const INITIAL_MESSAGE: AssistantMessage = {
  role: "assistant",
  content:
    "Tashi Delek. I am your Tibetan medicine assistant. I can answer questions related to Sowa Rigpa, traditional remedies, lifestyle guidance, and preparation for consultation. I cannot help with unrelated topics.",
};

const MAX_HISTORY = 12;

const AIAssistantChat = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AssistantMessage[]>([INITIAL_MESSAGE]);

  const canSend = useMemo(() => input.trim().length > 0 && !isLoading, [input, isLoading]);

  const onSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const nextMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const history = nextMessages.slice(-MAX_HISTORY);
      const reply = await sendAssistantMessage(text, history);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I cannot answer right now. Please try again in a moment, or contact the clinic directly for medical guidance.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <Card className="w-[22rem] sm:w-[24rem] shadow-xl border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5 text-accent" />
                Tibetan Medicine Assistant
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close assistant">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Informational support only. For diagnosis or urgent issues, consult a qualified doctor.
            </p>
          </CardHeader>

          <CardContent className="space-y-3">
            <ScrollArea className="h-72 rounded-md border p-3 bg-background/70">
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`max-w-[85%] rounded-md px-3 py-2 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {message.content}
                  </div>
                ))}
                {isLoading && <p className="text-xs text-muted-foreground">Assistant is thinking...</p>}
              </div>
            </ScrollArea>

            <div className="space-y-2">
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void onSend();
                  }
                }}
                placeholder="Ask about Tibetan medicine, remedies, diet, or lifestyle..."
                className="min-h-[72px] resize-none"
              />
              <Button onClick={() => void onSend()} className="w-full" disabled={!canSend}>
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button size="icon" className="h-14 w-14 rounded-full shadow-lg" onClick={() => setOpen(true)}>
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default AIAssistantChat;
