// src/app/admin/faqManagement/page.jsx
import connectMongoDB from "@/libs/mongodb";
import React from "react";
import Link from "next/link";
import Faq from "@/models/faq";
import RemoveBtn from "@/components/admin/RemoveBtn";
import { HiPencilAlt } from "react-icons/hi";

export default async function FaqManagementPage() {
  // connect & load all faqs, most recent first
  await connectMongoDB();
  const faqs = await Faq.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="flex">
      <main className="flex-1 p-6 bg-purple-50 rounded-lg m-3">
        <h1 className="text-2xl mb-4">Faq Management</h1>
        <Link
          href={`/admin/faqManagement/add`}
          className="mb-6 inline-block bg-purple-500 text-white px-4 py-2 rounded shadow"
        >
          Add FAQ
        </Link>
        {faqs.length === 0 ? (
          <p className="text-gray-600">No faqs found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {faqs.map((faq) => (
              <div
                key={faq._id.toString()}
                className="flex flex-col h-full bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Details */}
                <div className="p-4 flex-grow space-y-1 text-base text-black break-words">
                  <p>
                    <strong>Question:</strong> {faq.question}
                  </p>
                  <p>
                    <strong>Answer:</strong> {faq.answer}
                  </p>
                  <p>
                    <strong>Context Type:</strong> {faq.contextType}
                  </p>
                  <p>
                    <strong>Context Key:</strong> {faq.contextKey}
                  </p>
                  <p>
                    <strong>Priority:</strong> {faq.priority}
                  </p>
                </div>
                <div className="flex justify-center gap-4 p-2">
                  <Link
                    href={`/admin/faqManagement/edit/${faq._id}`}
                  >
                    <HiPencilAlt size={23} />
                  </Link>
                  <RemoveBtn id={faq._id.toString()} resource="faq" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
