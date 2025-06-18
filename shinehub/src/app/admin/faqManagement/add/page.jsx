// src/app/admin/faqManagement/add/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddFaqPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer]     = useState("");
  const [contexts, setContexts] = useState("");
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
      contexts: contexts
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
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
    <main className="p-6 bg-purple-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Add New FAQ</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-lg mx-auto space-y-4">
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
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Contexts (comma-separated)</label>
          <input
            type="text"
            value={contexts}
            onChange={(e) => setContexts(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g., general, billing"
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

        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Add FAQ
        </button>
      </form>
    </main>
  );
}
