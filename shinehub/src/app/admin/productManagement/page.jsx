import CategorySidebar from "@/components/admin/CategorySidebar";
import Link from "next/link";

import Polisher from "@/models/polisher";
import Pad from "@/models/pad";
import Compound from "@/models/compound";
import RemoveBtn from "@/components/admin/RemoveBtn";
import { HiPencilAlt } from 'react-icons/hi';

async function getAllProducts() {
  const polishers = await Polisher.find().lean();
  const pads = await Pad.find().lean();
  const compounds = await Compound.find().lean();

  // Combine products from all categories
  return [
    ...polishers.map(item => ({ ...item, category: "polisher" })),
    ...pads.map(item => ({ ...item, category: "pad" })),
    ...compounds.map(item => ({ ...item, category: "compound" })),
  ];
}

export default async function ProductManagement() {
  const products = await getAllProducts();

  const prettyName = {
    polisher: "Polishers",
    pad: "Pads",
    compound: "Compounds",
  };

  return (
    <div className="flex">
      <CategorySidebar />

      <main className="flex-1 p-6 bg-purple-50 rounded-lg m-3">
        <h1 className="text-4xl font-bold text-center uppercase mb-5 text-purple-600">
          All Products
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <p className="text-gray-600">No products found.</p>
          ) : (
            products.map((item) => {
              const firstUrl = item.images?.[0]?.url || '/placeholder.png';
              return (
                <div
                  key={item._id}
                  className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="w-full h-48 mt-2 bg-white flex items-center justify-center">
                    <img
                      src={firstUrl}
                      alt={item.name}
                      className="h-full object-contain"
                    />
                  </div>

                  <div className="p-4 text-center">
                    <h2 className="font-medium">{item.name}</h2>
                    <p className="text-sm text-gray-500">
                      {prettyName[item.category]}
                    </p>
                  </div>

                  <div className="flex justify-center gap-4 p-2">
                    <Link href={`/admin/productManagement/${item.category}/edit/${item._id}`}>
                      <HiPencilAlt size={23} />
                    </Link>
                    <RemoveBtn id={item._id} resource={item.category} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
