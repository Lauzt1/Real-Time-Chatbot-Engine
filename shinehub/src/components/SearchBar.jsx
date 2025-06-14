'use client'
import { useState } from 'react'
import { HiSearch } from 'react-icons/hi'

export default function SearchBar() {
  const [query, setQuery] = useState('')

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Product"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="pl-3 pr-10 py-1 rounded-full text-gray-800 bg-white"
      />
      <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
        <HiSearch className="h-5 w-5 text-gray-600" />
      </button>
    </div>
  )
}
