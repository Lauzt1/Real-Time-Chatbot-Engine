// src/components/admin/EnquirySidebar.jsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function EnquirySidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-48 bg-purple-200 p-4 rounded-lg ml-5 mt-3 mb-3">
      <h2 className="text-purple-700 text-lg font-medium mb-4">
        Enquiry Categories
      </h2>
      <ul className="space-y-2">
        <li>
          <Link
            href="/admin/enquiryManagement/enquiry"
            className={`block w-full text-center py-2 rounded transition-colors ${
              pathname === '/admin/enquiryManagement/enquiry'
                ? 'bg-purple-600 text-white'
                : 'text-purple-700 hover:bg-purple-300'
            }`}
          >
            Product’s Enquiries
          </Link>
        </li>
        <li>
          <Link
            href="/admin/enquiryManagement/message"
            className={`block w-full text-center py-2 rounded transition-colors ${
              pathname === '/admin/enquiryManagement/message'
                ? 'bg-purple-600 text-white'
                : 'text-purple-700 hover:bg-purple-300'
            }`}
          >
            General Messages
          </Link>
        </li>
      </ul>
    </aside>
  )
}
