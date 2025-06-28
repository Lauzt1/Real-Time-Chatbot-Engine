"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HiChat } from "react-icons/hi";

export default function ChatbotWidget() {
  const pathname = usePathname();
  const router = useRouter();
  const pageRef = useRef(pathname);
  pageRef.current = pathname;

  // ─── 1) determine FAQ context from URL ──────────────────────────────
  const productMatch = pathname.match(
    /^\/product\/(polisher|pad|compound)\/([^/]+)$/
  );
  const contextType = productMatch ? productMatch[1] : "general";
  // ────────────────────────────────────────────────────────────────────

  // ─── 1a) fetch the current product’s data for placeholder substitution ───
  const [productData, setProductData] = useState(null);
  useEffect(() => {
    if (productMatch) {
      const [, type, id] = productMatch;
      fetch(`/api/${type}s/${id}`)
        .then((res) => res.json())
        .then((data) => setProductData(data))
        .catch((err) => console.error("Failed to load product data:", err));
    } else {
      setProductData(null);
    }
  }, [productMatch]);
  // ────────────────────────────────────────────────────────────────────

  // ─── 2) FAQ state ───────────────────────────────────────────────────
  const [faqs, setFaqs] = useState([]);
  const [excludedFaqs, setExcludedFaqs] = useState([]);
  // ────────────────────────────────────────────────────────────────────

  const [sessionId] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const messagesContainerRef = useRef(null);

  // ─── 3) when context changes, reset exclusions ──────────────────────
  useEffect(() => {
    setExcludedFaqs([]);
  }, [contextType]);
  // ────────────────────────────────────────────────────────────────────

  // ─── 4) fetch top-4 FAQs for this context ──────────────────────────
  useEffect(() => {
    async function loadFaqs() {
      let url = `/api/faq?context=${contextType}`;
      if (productMatch) {
        const productId = productMatch[2];
        url += `&id=${productId}`;
      }
      if (excludedFaqs.length) {
        url += `&exclude=${excludedFaqs.join(",")}`;
      }
      try {
        const res = await fetch(url);
        if (res.ok) {
          setFaqs(await res.json());
        }
      } catch (e) {
        console.error("Failed to load FAQs", e);
      }
    }
    loadFaqs();
  }, [contextType, excludedFaqs]);
  // ────────────────────────────────────────────────────────────────────

  // send page slot to Rasa (unchanged)
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
    ).catch((err) => console.error("Failed to send page context slot:", err));
  }, [sessionId, pathname]);

  // auto-scroll (unchanged)
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
      botReplies.forEach((bot) =>
        setMessages((prev) => [...prev, { from: "bot", text: bot.text }])
      );
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }

  // ─── 5) handle FAQ pill click ───────────────────────────────────────
  function handleFaqClick(faq) {
    let filled = faq.answer.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
      if (!productData) return "";
      const val = productData[key.trim()];
      return val != null ? String(val) : "";
    });

    setMessages((prev) => [
      ...prev,
      { from: "user", text: faq.question },
      { from: "bot", text: filled },
    ]);
    setExcludedFaqs((prev) => [...prev, faq.id]);
  }
  // ────────────────────────────────────────────────────────────────────

  // regex to detect full URLs or /product/... paths (including hash/query)
  const urlRegex = /(https?:\/\/[^\s]+|\/product\/[^\s#?]*(?:[#?][^\s]*)?)/g;

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
          style={{ width: "30vw", minWidth: "400px", height: "70vh" }}
        >
          {/* HEADER */}
          <div className="bg-purple-600 flex items-center px-6 py-2 rounded-t-lg -mt-4 -mx-4 mb-3">
            <img
              src="/quentin.png"
              alt="Quentin"
              className="h-14 w-14 rounded-full mr-3"
            />
            <span className="text-white font-semibold text-2xl">
              Quentin
            </span>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto mb-2"
          >
            {messages.map((m, i) => {
              const parts = m.text.split(urlRegex);
              return (
                <div
                  key={i}
                  className={m.from === "user" ? "text-right" : "text-left"}
                >
                  <span
                    className={`inline-block p-2 my-1 rounded ${
                      m.from === "user" ? "bg-purple-100" : "bg-gray-100"
                    }`}
                  >
                    {parts.map((part, idx) => {
                      if (urlRegex.test(part)) {
                        const urlObj = part.startsWith("http")
                          ? new URL(part)
                          : new URL(part, window.location.origin);
                        const destination =
                          urlObj.pathname + urlObj.search + urlObj.hash;
                        return (
                          <a
                            key={idx}
                            href={urlObj.toString()}
                            onClick={(e) => {
                              e.preventDefault();
                              router.push(destination);
                            }}
                            className="underline text-blue-600 hover:text-blue-800"
                          >
                            {urlObj.pathname}
                          </a>
                        );
                      }
                      return part;
                    })}
                  </span>
                </div>
              );
            })}
          </div>

          {/* FAQ pills */}
          <div className="mb-2 flex flex-wrap">
            {faqs.map((f) => (
              <button
                key={f.id}
                onClick={() => handleFaqClick(f)}
                className="px-3 py-1 bg-gray-200 rounded-full text-base m-1 hover:bg-gray-300"
              >
                {f.question}
              </button>
            ))}
          </div>

          {/* Input form */}
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
