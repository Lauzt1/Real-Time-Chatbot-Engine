// src/components/ContactInfo.js
'use client'
import { HiOutlinePhone, HiMail, HiOutlineLocationMarker } from "react-icons/hi";

export default function ContactInfo() {
  return (
    <div className="bg-purple-200 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Find Us</h2>
      <ul className="space-y-3 text-gray-800">
        <li className="flex items-center">
          <HiOutlinePhone className="h-5 w-5 mr-2" />
          +6 012-345 6789
        </li>
        <li className="flex items-center">
          <HiMail className="h-5 w-5 mr-2" />
          shinehub@gmail.com
        </li>
        <li className="flex items-center">
          <HiOutlineLocationMarker className="h-5 w-5 mr-2" />
          Persiaran Multimedia, 63100 Cyberjaya, Selangor
        </li>
      </ul>
    </div>
  )
}
