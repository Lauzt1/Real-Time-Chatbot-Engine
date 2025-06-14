'use client'
import Link from 'next/link'
import SearchBar from './SearchBar'

export default function Navbar() {
  return (
    <nav className="bg-purple-600 text-white rounded-full mx-4 p-1 flex items-center justify-between px-6">
      <Link href="/">
        <span className="font-bold text-lg cursor-pointer">Shine Hub</span>
      </Link>
      <div className="flex items-center space-x-6">
        <Link href="/">
          <span className="hover:underline cursor-pointer">Home</span>
        </Link>
        <Link href="/product">
          <span className="hover:underline cursor-pointer">Products</span>
        </Link>
        <Link href="/contactUs">
          <span className="hover:underline cursor-pointer">Contact Us</span>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <SearchBar />
      </div>
    </nav>
  )
}
