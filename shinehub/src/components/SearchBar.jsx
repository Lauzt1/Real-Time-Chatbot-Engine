// src/components/SearchBar.jsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HiSearch } from 'react-icons/hi'

export default function SearchBar({ initialQuery = "" }) {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    router.push(`/search?query=${encodeURIComponent(q)}`)
    setQuery("")
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        placeholder="Search products…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-3 pr-10 py-1 rounded-full text-gray-800 bg-white"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 transform -translate-y-1/2"
      >
        <HiSearch className="h-5 w-5 text-gray-600 cursor-pointer" />
      </button>
    </form>
  )
}
