// src/app/admin/layout.js
import '../globals.css'            // or wherever your tailwind imports live
import AdminNavbar from '@/components/admin/Navbar'

export const metadata = {
  title: 'Shine Hub Admin',
}

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50">
        {/* only the admin navbar */}
        <AdminNavbar />

        {/* admin page content */}
        <main className="flex-grow container mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  )
}
