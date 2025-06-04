"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ChatbotWidget() {
  const pathname = usePathname();
  const pageRef = useRef(pathname);    // store current page
  pageRef.current = pathname;         // update on each render

  const [sessionId] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Send page context only once on mount
  useEffect(() => {
  fetch(
    `${process.env.NEXT_PUBLIC_RASA_URL}/conversations/${sessionId}/events`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "slot",
        name: "page",
        value: pathname               // current URL
      })
    }
  );
}, []);                               // run once

  async function sendMessage(text, metadata = {}) {
    // Always inject the page into metadata
    const fullMeta = { ...metadata, page: pageRef.current };

    // Only add a “user” bubble if text is non‐empty
    if (text.trim()) {
      setMessages((prev) => [...prev, { from: "user", text }]);
    }

    // Forward to our API, which proxies to Rasa
    const res = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: sessionId,
        message: text,
        metadata: fullMeta,
      }),
    });

    if (!res.ok) {
      console.error("NextAPI /api/chat failed:", await res.text());
      return;
    }

    const botReplies = await res.json();
    botReplies.forEach((bot) => {
      setMessages((prev) => [...prev, { from: "bot", text: bot.text }]);
    });
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 p-4 bg-white shadow-lg rounded-lg">
      <div className="h-80 overflow-y-auto mb-2">
        {messages.map((m, i) => (
          <div key={i} className={m.from === "user" ? "text-right" : "text-left"}>
            <span
              className={`inline-block p-2 my-1 rounded ${
                m.from === "user" ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          sendMessage(input);
          setInput("");
        }}
      >
        <input
          className="w-full border p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
        />
      </form>
    </div>
  );
}
