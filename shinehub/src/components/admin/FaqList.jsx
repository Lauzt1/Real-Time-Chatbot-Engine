// src/components/admin/FaqList.jsx
"use client";

import { useState, useEffect } from "react";
import RemoveBtn from "./RemoveBtn";

export default function FaqList() {
  const [faqs, setFaqs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await fetch("/api/faq");
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();
        // unwrap either { faq: […] } or { faqs: […] } or a raw array
        const list = Array.isArray(data)
          ? data
          : data.faq || data.faqs || [];
        setFaqs(list);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadFaqs();
  }, []);

  if (loading) return <p>Loading FAQs…</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (faqs.length === 0) return <p>No FAQs found.</p>;

  return (
    <div className="space-y-4">
      {faqs.map((f) => (
        <div
          key={f._id.toString()}
          className="p-4 border border-slate-300 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-xl">{f.question}</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Answer: {f.answer}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Context: {f.context}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Priority: {f.priority}
                </p>
            </div>
            <RemoveBtn id={f._id.toString()} resource="faq" />
          </div>
        </div>
      ))}
    </div>
  );
}
