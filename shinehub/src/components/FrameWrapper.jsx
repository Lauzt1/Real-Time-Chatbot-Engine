// src/components/FrameWrapper.jsx
'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/NavBar'
import Chatbot from '@/components/Chatbot'
import Footer from '@/components/Footer'

export default function FrameWrapper({ children }) {
  const path = usePathname()
  const isAdmin = path.startsWith('/admin')

  return (
    <>
      {!isAdmin ? (
        <>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Chatbot />
          <Footer />
        </>
     ) : (
       // admin layout will handle its own navbar and footer
       children
     )}
    </>
  )
}
