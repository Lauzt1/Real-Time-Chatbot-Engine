// src/app/admin/productManagement/page.jsx
import CategorySidebar from "@/components/admin/CategorySidebar";
import Link from "next/link";
import Polisher from "@/models/polisher";
import Pad from "@/models/pad";
import Compound from "@/models/compound";
import RemoveBtn from "@/components/admin/RemoveBtn";
import { HiPencilAlt } from 'react-icons/hi';

// Fetch and convert products to plain objects
async function getAllProducts() {
  const [polishers, pads, compounds] = await Promise.all([
    Polisher.find().lean(),
    Pad.find().lean(),
    Compound.find().lean(),
  ]);

  // Helper to map and stringify mongoose ObjectId and nested images
  const mapItem = (item, category) => {
    const { _id, images, ...rest } = item;
    return {
      id: _id.toString(),
      images: Array.isArray(images)
        ? images.map(({ _id: imgId, url, publicId, ...imgRest }) => ({
            id: imgId.toString(),
            url,
            publicId,
            ...imgRest,
          }))
        : [],
      ...rest,
      category,
    };
  };

  return [
    ...polishers.map((item) => mapItem(item, "polisher")),
    ...pads.map((item) => mapItem(item, "pad")),
    ...compounds.map((item) => mapItem(item, "compound")),
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

        {products.length === 0 ? (
          <p className="text-gray-600">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((item) => {
              const firstUrl = item.images?.[0]?.url || '/placeholder.png';
              return (
                <div
                  key={item.id}
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
                    <Link href={`/admin/productManagement/${item.category}/edit/${item.id}`}>
                      <HiPencilAlt size={23} />
                    </Link>
                    <RemoveBtn id={item.id} resource={item.category} />
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
