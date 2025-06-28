// src/app/admin/enquiryManagement/enquiry/page.jsx
import connectMongoDB from "@/libs/mongodb";
import Enquiry from "@/models/enquiry";
import React from "react";
import RemoveBtn from "@/components/admin/RemoveBtn";
import EnquirySidebar from "@/components/admin/EnquirySidebar";

export default async function EnquiryManagementPage() {
  await connectMongoDB();
  const enquiries = await Enquiry.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="flex">
      <EnquirySidebar />

      <main className="flex-1 p-6 bg-purple-50 rounded-lg m-3">
        <h1 className="text-2xl mb-4">Product Enquiries</h1>

        {enquiries.length === 0 ? (
          <p className="text-gray-600">No enquiries yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enquiries.map((enq) => (
              <div
                key={enq._id}
                className="flex flex-col h-full bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="p-4 border-b">
                  <h2 className="font-medium text-2xl text-black">
                    {enq.productName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    category: {enq.category}
                  </p>
                  <p className="text-sm text-gray-500">
                    product id: {enq.productId}
                  </p>
                  <p className="text-sm text-gray-500">
                    received: {new Date(enq.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Details */}
                <div className="p-4 flex-grow space-y-1 text-base text-black break-words">
                  <p>
                    <strong>Name:</strong> {enq.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {enq.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {enq.phoneNumber}
                  </p>
                  <p>
                    <strong>Company:</strong> {enq.companyName}
                  </p>
                  <p>
                    <strong>Message:</strong> {enq.message}
                  </p>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <a
                    href={`mailto:${enq.email}`}
                    className="text-blue-600 underline"
                  >
                    Send Email
                  </a>
                  <RemoveBtn id={enq._id.toString()} resource="enquiry" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
