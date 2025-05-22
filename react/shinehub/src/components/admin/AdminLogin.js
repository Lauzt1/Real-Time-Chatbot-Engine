// src/components/AdminLogin.js
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [creds, setCreds] = useState({ id:'', password:'' })
  const router = useRouter()

  const handleSubmit = async e => {
    e.preventDefault()
    // TODO: POST to `/api/auth/login`
    router.push('/admin')
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 p-6 bg-white rounded-lg shadow space-y-4">
      <h2 className="text-2xl font-semibold">Admin Login</h2>
      <input
        name="id"
        value={creds.id}
        onChange={e => setCreds({ ...creds, id: e.target.value })}
        placeholder="Admin ID"
        className="w-full px-3 py-2 border rounded"
        required
      />
      <input
        type="password"
        name="password"
        value={creds.password}
        onChange={e => setCreds({ ...creds, password: e.target.value })}
        placeholder="Password"
        className="w-full px-3 py-2 border rounded"
        required
      />
      <button type="submit" className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        Log In
      </button>
    </form>
  )
}
