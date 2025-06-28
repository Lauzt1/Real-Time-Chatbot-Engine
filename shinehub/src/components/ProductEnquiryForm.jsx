// src/components/ProductEnquiryForm.jsx
"use client";

import { useState } from "react";

export default function ProductEnquiryForm({ category, productId, productName }) {
  const [name,        setName]        = useState("");
  const [email,       setEmail]       = useState("");
  const [phone,       setPhone]       = useState("");
  const [company,     setCompany]     = useState("");
  const [message,     setMessage]     = useState("");
  const [submitting,  setSubmitting]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(name&&email&&phone&&company&&message)) {
      alert("All fields are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          productId,
          productName,
          name,
          email,
          phoneNumber: phone,
          companyName: company,
          message,
        }),
      });
      if (res.ok) {
        alert("Your enquiry has been sent!");
        setName("");
        setEmail("");
        setPhone("");
        setCompany("");
        setMessage("");
      } else {
        throw new Error(await res.text());
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send enquiry, make sure all fields are entered correctly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4 text-center">
      <h2 className="text-2xl font-semibold">Enquire about {productName}</h2>
      <input
        type="text" placeholder="Your Name"
        className="w-full border px-3 py-2 rounded"
        value={name} onChange={e=>setName(e.target.value)} required
      />
      <input
        type="email" placeholder="Email Address"
        className="w-full border px-3 py-2 rounded"
        value={email} onChange={e=>setEmail(e.target.value)} required
      />
      <input
        type="text" placeholder="Phone Number"
        className="w-full border px-3 py-2 rounded"
        value={phone} onChange={e=>setPhone(e.target.value)} required
      />
      <input
        type="text" placeholder="Company Name"
        className="w-full border px-3 py-2 rounded"
        value={company} onChange={e=>setCompany(e.target.value)} required
      />
      <textarea
        placeholder="Your Enquiry"
        className="w-full border px-3 py-2 rounded"
        rows={4}
        value={message} onChange={e=>setMessage(e.target.value)} required
      />
      <div className="text-center">
        <button
          type="submit"
          disabled={submitting}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {submitting ? "Sending…" : "Send Enquiry"}
        </button>
      </div>
    </form>
  );
}
