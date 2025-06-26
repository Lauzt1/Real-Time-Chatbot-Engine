import Link from 'next/link';

export default function EnquiryMgt () {
    return (
        <nav className="bg-purple-600 text-white px-6 py-3 items-center justify-between rounded-full mx-4">


      {/* Nav links */}
      <div className="flex items-center space-x-6">
        <Link href="/admin/enquiryMgt/enquiry">
          <span className="hover:underline cursor-pointer">Product's Enquiries</span>
        </Link>
        <Link href="/admin/enquiryMgt/message">
          <span className="hover:underline cursor-pointer">Messages</span>
        </Link>
      </div>
      </nav>
    )
}