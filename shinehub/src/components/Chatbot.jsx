"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { HiChat } from "react-icons/hi";

export default function ChatbotWidget() {
  const pathname = usePathname();
  const pageRef = useRef(pathname);
  pageRef.current = pathname;

  const [sessionId] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const messagesContainerRef = useRef(null);

  // Send (or re-send) page context whenever the URL changes
  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_RASA_URL}/conversations/${sessionId}/tracker/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "slot",
          name: "page",
          value: pathname,
        }),
      }
    ).catch((err) =>
      console.error("Failed to send page context slot:", err)
    );
  }, [sessionId, pathname]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage(text) {
    const fullMeta = { page: pageRef.current };

    if (text.trim()) {
      setMessages((prev) => [...prev, { from: "user", text }]);
    }

    try {
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
        console.error("NextAPI /api/chatbot failed:", await res.text());
        return;
      }

      const botReplies = await res.json();
      botReplies.forEach((bot) => {
        setMessages((prev) => [...prev, { from: "bot", text: bot.text }]);
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 flex flex-col-reverse items-end gap-2">
      {/* Toggle Button */}
      <div
        onClick={() => setIsOpen((o) => !o)}
        className="h-12 w-12 bg-purple-600 rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg"
      >
        <HiChat className="text-2xl" />
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="p-4 bg-white shadow-lg rounded-lg flex flex-col"
          style={{ width: "30vw", minWidth: "400px", height: "75vh" }}
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
                    m.from === "user" ? "bg-purple-100" : "bg-gray-100"
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
              className="bg-purple-600 text-white p-2 rounded-r"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
