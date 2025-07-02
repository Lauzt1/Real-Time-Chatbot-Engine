// src/app/product/[category]/type/[type]/page.jsx
import CategorySidebar from "@/components/CategorySidebar";
import Link from "next/link";
import connectMongoDB from "@/libs/mongodb";
import Polisher from "@/models/polisher";
import Pad from "@/models/pad";
import Compound from "@/models/compound";

function getModel(category) {
  switch (category) {
    case "polisher": return Polisher;
    case "pad":      return Pad;
    case "compound": return Compound;
    default:         throw new Error("Unknown category");
  }
}

export default async function TypePage({ params }) {
  // await the params promise before destructuring
  const { category, type } = await params;
  const formattedType = type.replace(/_/g, ' ');

  await connectMongoDB();

  // fetch raw documents
  const Model = getModel(category);
  const rawItems = await Model.find({ type: formattedType }).lean();

  // convert to plain JS objects
  const items = rawItems.map(({ _id, images, ...rest }) => ({
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

  const pretty = {
    polisher: "Polishers",
    pad: "Pads",
    compound: "Compounds",
  }[category];

  return (
    <div className="flex">
      <CategorySidebar active={category} filter={formattedType} />

      <main className="flex-1 p-6 bg-purple-50 rounded-lg m-3">
        <h1 className="text-2xl mb-4">
          {pretty}: {formattedType.charAt(0).toUpperCase() + formattedType.slice(1)}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const firstUrl = item.images[0]?.url || "/placeholder.png";
            return (
              <Link
                key={item.id}
                href={`/product/${category}/${item.id}`}
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
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}