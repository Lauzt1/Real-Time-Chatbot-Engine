// src/app/admin/page.jsx
import connectMongoDB from "@/libs/mongodb";
import Polisher from "@/models/polisher";
import Pad from "@/models/pad";
import Compound from "@/models/compound";
import Enquiry from "@/models/enquiry";
import Message from "@/models/message";
import Faq from "@/models/faq";
import Link from "next/link";

export default async function AdminDashboard() {
  await connectMongoDB();

  // fetch all your counts in parallel
  const [
    polishersCount,
    padsCount,
    compoundsCount,
    featuredPolishersCount,
    featuredPadsCount,
    featuredCompoundsCount,
    totalEnquiries,
    pendingEnquiries,
    totalMessages,
    pendingMessages,
    faqsCount,
  ] = await Promise.all([
    Polisher.countDocuments(),
    Pad.countDocuments(),
    Compound.countDocuments(),
    Polisher.countDocuments({ featured: true }),
    Pad.countDocuments({ featured: true }),
    Compound.countDocuments({ featured: true }),
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ status: "pending" }),
    Message.countDocuments(),
    Message.countDocuments({ status: "pending" }),
    Faq.countDocuments(),
  ]);

  return (
    <main className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Products */}
      <Link
        href="/admin/productManagement"
        className="bg-white rounded-lg shadow p-6 flex flex-col"
      >
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <ul className="space-y-2 text-gray-700">
          <li>
            🔧 Polishers: <strong>{polishersCount}</strong>{" "}
            <span className="text-yellow-500">
              ( ⭐ {featuredPolishersCount} featured )
            </span>
          </li>
          <li>
            🟣 Pads: <strong>{padsCount}</strong>{" "}
            <span className="text-yellow-500">
              ( ⭐ {featuredPadsCount} featured )
            </span>
          </li>
          <li>
            🧴 Compounds: <strong>{compoundsCount}</strong>{" "}
            <span className="text-yellow-500">
              ( ⭐ {featuredCompoundsCount} featured )
            </span>
          </li>
        </ul>
      </Link>

      {/* Enquiries & Messages */}
      <Link
        href="/admin/enquiryManagement"
        className="bg-white rounded-lg shadow p-6 flex flex-col"
      >
        <h2 className="text-xl font-semibold mb-4">Enquiries &amp; Messages</h2>
        <ul className="space-y-2">
          <li>
            📨 Total Enquiries: <strong>{totalEnquiries}</strong>
          </li>
          <li>
            ⏳ Pending Enquiries: <strong>{pendingEnquiries}</strong>
          </li>
          <li>
            ✉️ Total Messages: <strong>{totalMessages}</strong>
          </li>
          <li>
            ⏳ Pending Messages: <strong>{pendingMessages}</strong>
          </li>
        </ul>
      </Link>

      {/* FAQs */}
      <Link
        href="/admin/faqManagement"
        className="bg-white rounded-lg shadow p-6 flex flex-col"
      >
        <h2 className="text-xl font-semibold mb-4">FAQs</h2>
        <p className="text-3xl font-bold text-center">{faqsCount}</p>
      </Link>
    </main>
  );
}
