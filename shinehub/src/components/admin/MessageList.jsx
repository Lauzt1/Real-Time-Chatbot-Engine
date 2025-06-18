// src/components/admin/MessageList.jsx
"use client";

import { useState, useEffect } from "react";
import RemoveBtn from "./RemoveBtn";

export default function MessageList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    async function loadMessages() {
      try {
        const res = await fetch("http://localhost:3000/api/message");
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();
        // If your API returns { message: [...] }, unwrap it
        const list = Array.isArray(data) ? data : data.message || [];
        setMessages(list);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadMessages();
  }, []);

  if (loading) {
    return <p>Loading messages…</p>;
  }
  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }
  if (messages.length === 0) {
    return <p>No messages found.</p>;
  }

  return (
    <div className="space-y-4">
      {messages.map((t) => (
        <div
          key={t._id.toString()}
          className="p-4 border border-slate-300 flex justify-between items-start bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div>
            <h2 className="font-bold text-xl">{t.name}</h2>
            <p>{t.email}</p>
            <p>{t.phoneNumber}</p>
            <p>{t.companyName}</p>
            <p className="mt-2">{t.message}</p>
          </div>
          <div className="flex items-start">
            <RemoveBtn id={t._id.toString()} resource="message" />
          </div>
        </div>
      ))}
    </div>
  );
}
