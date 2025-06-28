// src/app/search/page.jsx
import connectMongoDB from "@/libs/mongodb";
import Polisher from "@/models/polisher";
import Pad from "@/models/pad";
import Compound from "@/models/compound";
import Link from "next/link";

export default async function SearchPage({ searchParams }) {
  const q = searchParams.query?.trim() || "";

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

  // flatten into a single array with a `category` field
  const results = [
    ...polishers.map((item) => ({ ...item, category: "polisher" })),
    ...pads.map((item) => ({ ...item, category: "pad" })),
    ...compounds.map((item) => ({ ...item, category: "compound" })),
  ];

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
            const firstUrl = item.images?.[0]?.url || "/placeholder.png";
            const catLabel = prettyName[item.category];
            return (
              <Link
                key={`${item.category}-${item._id}`}
                href={`/product/${item.category}/${item._id}`}
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
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
