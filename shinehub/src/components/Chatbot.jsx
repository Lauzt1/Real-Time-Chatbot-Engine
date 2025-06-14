'use client'
import { useState } from 'react'

export default function Chatbot() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col overflow-hidden">
          <div className="bg-purple-600 text-white px-4 py-2 flex justify-between items-center">
            <span>Chat with us</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            {/* messages */}
          </div>
          <form className="p-2 border-t flex">
            <input
              className="flex-grow px-2 py-1 border rounded"
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className="ml-2 px-3 py-1 bg-purple-600 text-white rounded"
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl"
          aria-label="Open chat"
        >
          💬
        </button>
      )}
    </div>
  )
}
