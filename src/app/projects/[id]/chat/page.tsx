"use client";

import { useState } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "이 프로젝트에 대해 궁금한 점을 물어보세요. 예: \"캄보디아를 추천한 이유가 뭐야?\"",
  },
];

export default function ChatTabPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
  }

  return (
    <div className="flex h-[28rem] flex-col rounded-xl border border-black/10 dark:border-white/10">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
              message.role === "assistant"
                ? "bg-black/5 dark:bg-white/10"
                : "ml-auto bg-foreground text-background"
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-black/10 p-3 dark:border-white/10">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="메시지를 입력하세요"
          className="flex-1 rounded-full border border-black/15 bg-transparent px-4 py-2 text-sm outline-none focus:border-foreground/40 dark:border-white/20"
        />
        <button
          type="submit"
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          전송
        </button>
      </form>
    </div>
  );
}
