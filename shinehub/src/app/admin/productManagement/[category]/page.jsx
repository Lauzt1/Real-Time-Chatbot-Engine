// src/app/admin/productManagement/[category]/page.jsx
import CategorySidebar from "@/components/admin/CategorySidebar"
import Link from "next/link"
import Polisher from "@/models/polisher"
import Pad from "@/models/pad"
import Compound from "@/models/compound"
import RemoveBtn from "@/components/admin/RemoveBtn"
import { HiPencilAlt } from 'react-icons/hi';

async function getProductsFor(category) {
  switch (category) {
    case "polisher":
      return Polisher.find().lean();
    case "pad":
      return Pad.find().lean();
    case "compound":
      return Compound.find().lean();
    default:
      throw new Error("Unknown category");
  }
}

export default async function CategoryPage({ params }) {
  // await the params promise
  const { category } = await params;

  let products;
  try {
    products = await getProductsFor(category);
  } catch {
    return <p>Category “{category}” not found</p>;
  }

  // convert Mongoose docs to plain objects
  const items = products.map(({ _id, images, ...rest }) => ({
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
  }));

  const pretty = {
    polisher: "Polishers",
    pad:      "Pads",
    compound: "Compounds",
  }[category];

  return (
    <div className="flex">
      <CategorySidebar active={category} />

      <main className="flex-1 p-6 bg-purple-50 rounded-lg m-3">
        <h1 className="text-2xl mb-4">{pretty}</h1>

        <Link
          href={`/admin/productManagement/${category}/add`}
          className="mb-6 inline-block bg-purple-500 text-white px-4 py-2 rounded shadow"
        >
          Add {pretty.slice(0, -1)}
        </Link>

        {items.length === 0 ? (
          <p className="text-gray-600">No {pretty.toLowerCase()} found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const firstUrl = item.images[0]?.url || '/placeholder.png';
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
                  </div>
                  <div className="flex justify-center gap-4 p-2">
                    <Link href={`/admin/productManagement/${category}/edit/${item.id}`}>
                      <HiPencilAlt size={23} />
                    </Link>
                    <RemoveBtn id={item.id} resource={category} />
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
