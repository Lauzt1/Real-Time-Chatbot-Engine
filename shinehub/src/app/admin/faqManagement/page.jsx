import FaqList from "@/components/admin/FaqList";
import Link from "next/link";

export default function faqManagement() {
    return (
        <>
        <Link
                  href={`/admin/faqManagement/add`}
                  className="mb-6 inline-block bg-purple px-4 py-2 rounded shadow"
                >
                  Add FAQ
                </Link>
        <FaqList />
        </>
    )
}