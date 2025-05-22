'use client'
import { useState } from 'react'

export default function EnquiryForm({ productId }) {
  const [form, setForm] = useState({ name:'', email:'', question:'' })

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    // TODO: POST to `/api/quotes`
    alert('Enquiry sent!')
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow space-y-4">
      <h2 className="text-2xl font-semibold">Enquiry for Product {productId}</h2>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Your Name"
        className="w-full px-3 py-2 border rounded"
        required
      />
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Your Email"
        className="w-full px-3 py-2 border rounded"
        required
      />
      <textarea
        name="question"
        value={form.question}
        onChange={handleChange}
        placeholder="Your Question"
        className="w-full px-3 py-2 border rounded h-32"
        required
      />
      <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        Submit Enquiry
      </button>
    </form>
  )
}
