import ProductCard from "@/components/admin/PolisherCard";
import Link from "next/link";

export default function ProductManagement() {
    return (
        <>
            <Link className="bg-white p-2" href="/admin/productManagement/addPolisher">Add Polisher</Link>
            <ProductCard />
        </>
    )
}