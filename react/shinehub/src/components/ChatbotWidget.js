"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ChatbotWidget() {
  const pathname = usePathname();
  const pageRef = useRef(pathname);
  pageRef.current = pathname;

  const [sessionId] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const messagesContainerRef = useRef(null);

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
          value: pathname,
        }),
      }
    );
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage(text, metadata = {}) {
    const fullMeta = { ...metadata, page: pageRef.current };

    if (text.trim()) {
      setMessages((prev) => [...prev, { from: "user", text }]);
    }

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
    <div className="fixed bottom-4 right-4 flex flex-col-reverse items-end gap-2">
      {/* Toggle Button */}
      <div
        onClick={() => setIsOpen((open) => !open)}
        className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg"
      >
        {/* Placeholder icon */}
        <span className="text-2xl">💬</span>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="p-4 bg-white shadow-lg rounded-lg flex flex-col"
          style={{ width: '30vw', height: '75vh' }}
        >
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto mb-2"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.from === "user" ? "text-right" : "text-left"}
              >
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
            className="flex"
          >
            <input
              className="flex-1 border p-2 rounded-l"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-r"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
