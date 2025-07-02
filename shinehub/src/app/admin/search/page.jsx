// src/app/admin/search/page.jsx
import connectMongoDB from "@/libs/mongodb";
import Link from "next/link";
import Polisher from "@/models/polisher";
import Pad from "@/models/pad";
import Compound from "@/models/compound";
import RemoveBtn from "@/components/admin/RemoveBtn";
import { HiPencilAlt } from "react-icons/hi";
import SearchBar from "@/components/admin/SearchBar";

export default async function SearchPage({ searchParams }) {
  // await the searchParams promise before using its properties
  const { query } = await searchParams;
  const q = query?.trim() || "";

  // if no query, just show the bar
  if (!q) {
    return (
      <main className="p-6">
        <SearchBar initialQuery={q} />
        <p className="mt-4 text-gray-600">Search again.</p>
      </main>
    );
  }

  await connectMongoDB();

  // case-insensitive regex search on `name`
  const regex = new RegExp(q, "i");
  const [polishers, pads, compounds] = await Promise.all([
    Polisher.find({ name: regex }).lean(),
    Pad.find({ name: regex }).lean(),
    Compound.find({ name: regex }).lean(),
  ]);

  // flatten and convert each document to a plain object with string id
  const results = [
    ...polishers.map((item) => ({ ...item, category: "polisher" })),
    ...pads.map((item) => ({ ...item, category: "pad" })),
    ...compounds.map((item) => ({ ...item, category: "compound" })),
  ].map(({ _id, images, ...rest }) => ({
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
  }));

  const prettyName = {
    polisher: "Polishers",
    pad: "Pads",
    compound: "Compounds",
  };

  return (
    <main className="p-6">
      <h1 className="text-5xl text-white font-semibold my-3">
        Search Results for: {q}
      </h1>

      {results.length === 0 ? (
        <p className="text-black text-xl">Sorry, no product found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((item) => {
            const firstUrl = item.images[0]?.url || "/placeholder.png";
            const catLabel = prettyName[item.category];
            return (
              <div
                key={`${item.category}-${item.id}`}
                className="block bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
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
                  <p className="text-sm text-gray-500">{catLabel}</p>
                </div>
                <div className="flex justify-center gap-4 p-2">
                  <Link
                    href={`/admin/productManagement/${item.category}/edit/${item.id}`}
                  >
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
  );
}
