import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ChatbotWidget from '../components/ChatbotWidget'

export const metadata = {
  title: 'Shine Hub',
  description: 'Your one-stop detailing shop',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

        <main className="flex-grow container mx-auto px-4 py-6">
          {children}
        </main>

        <Footer />
        <ChatbotWidget />
      </body>
    </html>
  )
}
