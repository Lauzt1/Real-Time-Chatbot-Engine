// src/app/admin/enquiryMgt/enquiry/page.jsx
import connectMongoDB from "@/libs/mongodb";
import Enquiry from "@/models/enquiry";
import React from "react";
import RemoveBtn from "@/components/admin/RemoveBtn";

export default async function EnquiryManagementPage() {
  await connectMongoDB();
  const enquiries = await Enquiry.find()
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Product Enquiries</h1>

      {enquiries.length === 0 ? (
        <p className="text-gray-600">No enquiries yet.</p>
      ) : (
        <ul className="space-y-4">
          {enquiries.map((enq) => (
            <li
              key={enq._id}
              className="border bg-white rounded-lg shadow p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-large font-bold">
                  {enq.productName} <em className="text-sm text-gray-500 font-normal">category: {enq.category} id:{enq.productId}</em>
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400">
                    {new Date(enq.createdAt).toLocaleString()}
                  </span>
                  <RemoveBtn id={enq._id.toString()} resource="enquiry" />
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Name:</strong> {enq.name}
                </p>
                <p>
                  <strong>Email:</strong> {enq.email}
                </p>
                <p>
                  <strong>Phone Number:</strong> {enq.phoneNumber}
                </p>
                <p>
                  <strong>Company:</strong> {enq.companyName}
                </p>
                <p>
                  <strong>Message:</strong> {enq.message}
                </p>
                <p>
                  <a
                    href={`mailto:${enq.email}`}
                    className="text-blue-600 underline"
                  >
                    Send Email
                  </a>
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
