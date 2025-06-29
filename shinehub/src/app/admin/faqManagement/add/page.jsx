// src/app/admin/faqManagement/add/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddFaqPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [contextType, setContextType] = useState("");
  const [contextKey, setContextKey] = useState("");
  const [priority, setPriority] = useState(0);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      alert("Question and answer are required.");
      return;
    }

    const payload = {
      question: question.trim(),
      answer: answer.trim(),
      contextType: contextType.trim(),
      contextKey: contextKey.trim(),
      priority: Number(priority),
    };

    try {
      const res = await fetch("/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add FAQ");

      alert("FAQ added successfully.");
      router.push("/admin/faqManagement");
    } catch (err) {
      console.error(err);
      alert("Error adding FAQ. Please try again.");
    }
  };

  return (
    <main className="m-5 flex flex-col items-center bg-purple-50 rounded-lg p-6 mx-auto max-w-3xl">
      <h1 className="text-xl font-semibold mb-4 text-purple-600">
        Add New FAQ
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-4 w-full"
      >
        <div>
          <label className="block mb-1 font-medium">Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Answer</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Context Type</label>
          <input
            type="text"
            value={contextType}
            onChange={(e) => setContextType(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Context Key</label>
          <input
            type="text"
            value={contextKey}
            onChange={(e) => setContextKey(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Priority</label>
          <input
            type="number"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Add FAQ
          </button>
        </div>
      </form>
    </main>
  );
}
