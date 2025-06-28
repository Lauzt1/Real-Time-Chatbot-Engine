// src/app/page.jsx
import Link from "next/link";
import connectMongoDB from "@/libs/mongodb";
import Polisher from "@/models/polisher";
import Pad from "@/models/pad";
import Compound from "@/models/compound";

async function getFeatured(model) {
  return model.find({ featured: true }).lean();
}

export default async function HomePage() {
  await connectMongoDB();
  const [polishers, pads, compounds] = await Promise.all([
    getFeatured(Polisher),
    getFeatured(Pad),
    getFeatured(Compound),
  ]);

  // flatten into a single array with category labels
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
      <h1 className="text-2xl text-purple-600 font-bold my-4">Featured Products</h1>

      {results.length === 0 ? (
        <p className="text-gray-600">No featured products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((item) => {
            const firstUrl = item.images?.[0]?.url || "/placeholder.png";
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
                  <p className="text-sm text-gray-500">
                    {prettyName[item.category]}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
