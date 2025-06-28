// src/app/admin/faqManagement/edit/[id]/page.jsx
'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditFaqPage() {
  const router = useRouter();
  const { id } = useParams();

  const [question,   setQuestion]   = useState("");
  const [answer,     setAnswer]     = useState("");
  const [contextType,setContextType]= useState("");
  const [contextKey, setContextKey] = useState("");
  const [priority,   setPriority]   = useState(0);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    async function loadFaq() {
      try {
        const res = await fetch(`/api/faq/${id}`);
        if (!res.ok) throw new Error("Load failed");
        const data = await res.json();
        // data might be the FAQ object itself
        setQuestion(data.question);
        setAnswer(data.answer);
        setContextType(data.contextType);
        setContextKey(data.contextKey || "");
        setPriority(data.priority || 0);
      } catch (err) {
        console.error(err);
        alert("Failed to load FAQ");
      } finally {
        setLoading(false);
      }
    }
    loadFaq();
  }, [id]);

  if (loading) return <p className="p-6">Loading…</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      alert("Question and answer are required.");
      return;
    }
    try {
      const res = await fetch(`/api/faq/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          answer: answer.trim(),
          contextType: contextType.trim(),
          contextKey: contextKey.trim(),
          priority: Number(priority),
        }),
      });
      if (!res.ok) throw new Error();
      alert("FAQ updated successfully.");
      router.push("/admin/faqManagement");
    } catch (err) {
      console.error(err);
      alert("Error updating FAQ. Please try again.");
    }
  };

  return (
    <main className="m-5 flex flex-col items-center bg-purple-50 rounded-lg p-6 mx-auto max-w-3xl">
      <h1 className="text-xl font-semibold mb-4 text-purple-600">
        Edit FAQ
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
            Save Changes
          </button>
        </div>
      </form>
    </main>
  );
}
