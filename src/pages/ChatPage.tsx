import { AppLayout } from "@/components/AppLayout";
import { MessageSquare, Send } from "lucide-react";
import { useState } from "react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Welcome to the GRIM Command Center. I'm your execution strategist. Ask me about task prioritization, sprint planning, goal alignment, or execution patterns. **Grim. Honor will come.**",
    },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content:
        "AI integration requires Lovable Cloud to be enabled. Once connected, I'll be able to analyze your execution patterns, suggest sprint priorities, and provide strategic guidance based on your GRIM data.",
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
  };

  return (
    <AppLayout>
      <div className="p-6 flex flex-col h-[calc(100vh-0px)]">
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-foreground">GRIM AI</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">
            Your execution strategist · Powered by AI
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin space-y-4 pb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] p-4 rounded-lg text-sm ${
                  msg.role === "user"
                    ? "grim-gradient text-primary-foreground"
                    : "grim-card"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-mono text-primary uppercase tracking-wider">
                      GRIM AI
                    </span>
                  </div>
                )}
                <p className="text-foreground leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about priorities, strategy, or execution..."
            className="flex-1 bg-secondary border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-3 rounded-md grim-gradient text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
