// src/components/admin/Navbar.js
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import SearchBar from './SearchBar'

export default function AdminNavbar() {
  const router = useRouter()

  const handleLogout = async () => {
    // Sign out and then redirect to the admin login page
    await signOut({ redirect: false })
    router.push('/admin/login')
  }

  return (
    <nav className="mt-3 mb-3 bg-purple-600 text-white rounded-full mx-4 p-3 flex items-center justify-between px-6">
      <Link href="/" target="_blank">
        <span className="font-bold text-lg cursor-pointer">Shine Hub</span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center space-x-6">
        <Link href="/admin">
          <span className="hover:underline cursor-pointer">Dashboard</span>
        </Link>
        <Link href="/admin/productManagement">
          <span className="hover:underline cursor-pointer">Product Management</span>
        </Link>
        <Link href="/admin/enquiryManagement">
          <span className="hover:underline cursor-pointer">Enquiry Management</span>
        </Link>
        <Link href="/admin/faqManagement">
          <span className="hover:underline cursor-pointer">Faq Management</span>
        </Link>
      </div>

      {/* Search, theme, logout */}
      <div className="flex items-center space-x-4 gap-5">
        <SearchBar />
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
