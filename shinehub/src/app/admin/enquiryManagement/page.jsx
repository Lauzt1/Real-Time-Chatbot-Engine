import connectMongoDB from "@/libs/mongodb";
import Enquiry from "@/models/enquiry";
import Message from "@/models/message";
import React from "react";
import RemoveBtn from "@/components/admin/RemoveBtn";
import EnquirySidebar from "@/components/admin/EnquirySidebar";
import ResponseBtn from "@/components/admin/ResponseBtn";

export default async function EnquiryManagementPage() {
  // Connect to MongoDB
  await connectMongoDB();

  // Fetch both Enquiries and Messages
  const enquiries = await Enquiry.find().sort({ createdAt: -1 }).lean();
  const messages = await Message.find().sort({ createdAt: -1 }).lean();

  // Combine both arrays (enquiries and messages)
  const allEnquiries = [...enquiries, ...messages];

  return (
    <div className="flex">
      <EnquirySidebar />

      <main className="flex-1 p-6 bg-purple-50 rounded-lg m-3">
        <h1 className="text-2xl mb-4">All Enquiries & Messages</h1>

        {allEnquiries.length === 0 ? (
          <p className="text-gray-600">No enquiries or messages found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allEnquiries.map((item) => {
              const isEnquiry = item.productId; // check if it is a product enquiry
              const firstUrl = item.images?.[0]?.url || "/placeholder.png";
              return (
                <div
                  key={item._id}
                  className="flex flex-col h-full bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Header */}
                  <div className="p-4 border-b">
                    <p className="text-sm text-gray-500 mb-2">
                      received: {new Date(item.createdAt).toLocaleString()}
                    </p>
                    <h2 className="font-medium text-2xl text-black">
                      {isEnquiry ? item.productName : "General Message"}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {isEnquiry ? `Product Enquiry` : " "}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="p-4 flex-grow space-y-1 text-base text-black break-words">
                    <p>
                      <strong>Name:</strong> {item.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {item.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {item.phoneNumber}
                    </p>
                    <p>
                      <strong>Company:</strong> {item.companyName}
                    </p>
                    <p>
                      <strong>Message:</strong> {item.message}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 flex justify-between items-center">
                    <a
                      href={`mailto:${item.email}`}
                      className="text-blue-600 underline"
                    >
                      Send Email
                    </a>
                    <ResponseBtn
                      id={item._id.toString()}
                      status={item.status}
                      inquiry={isEnquiry ? "enquiry" : "message"}
                    />
                    <RemoveBtn id={item._id.toString()} resource={isEnquiry ? "enquiry" : "message"} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
