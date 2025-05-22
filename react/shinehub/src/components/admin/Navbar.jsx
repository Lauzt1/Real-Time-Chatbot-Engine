// src/components/AdminNavbar.js
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SearchBar from '../SearchBar'
import ThemeToggle from '../ThemeToggle'

export default function AdminNavbar() {
  const router = useRouter()

  const handleLogout = async () => {
    // call your logout API route (adjust path if needed)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <nav className="bg-purple-600 text-white px-6 py-3 flex items-center justify-between rounded-full mx-4">
      {/* Logo */}
      <Link href="/">
        <span className="font-bold text-lg cursor-pointer">Shine Hub</span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center space-x-6">
        <Link href="/admin/products">
          <span className="hover:underline cursor-pointer">Products Managment</span>
        </Link>
        <Link href="/admin/quotes">
          <span className="hover:underline cursor-pointer">Quotes Management</span>
        </Link>
      </div>

      {/* Search, theme, logout */}
      <div className="flex items-center space-x-4">
        <SearchBar />
        <ThemeToggle />
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
