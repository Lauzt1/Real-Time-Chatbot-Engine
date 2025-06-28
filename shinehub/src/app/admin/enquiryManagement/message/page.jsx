// src/app/admin/enquiryManagement/message/page.jsx
import connectMongoDB from "@/libs/mongodb";
import Message from "@/models/message";
import React from "react";
import RemoveBtn from "@/components/admin/RemoveBtn";
import EnquirySidebar from "@/components/admin/EnquirySidebar";
import ResponseBtn from "@/components/admin/ResponseBtn";

export default async function MessageManagementPage() {
  await connectMongoDB();
  const messages = await Message.find()
    .sort({ status: 1, createdAt: -1 })
    .lean();

  return (
    <div className="flex">
      <EnquirySidebar />

      <main className="flex-1 p-6 bg-purple-50 rounded-lg m-3">
        <h1 className="text-2xl mb-4">General Messages</h1>

        {messages.length === 0 ? (
          <p className="text-gray-600">No messages found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.map((msg) => (
              <div
                key={msg._id.toString()}
                className="flex flex-col h-full bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Details */}
                <div className="p-4 flex-grow space-y-1 text-base text-black break-words">
                  <p className="text-sm text-gray-500 mb-2">
                    received: {new Date(msg.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Name:</strong> {msg.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {msg.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {msg.phoneNumber}
                  </p>
                  <p>
                    <strong>Company:</strong> {msg.companyName}
                  </p>
                  <p>
                    <strong>Message:</strong> {msg.message}
                  </p>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-blue-600 underline"
                  >
                    Send Email
                  </a>
                  <ResponseBtn id={msg._id.toString()} status={msg.status} inquiry="message" />
                  <RemoveBtn id={msg._id.toString()} resource="message" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}