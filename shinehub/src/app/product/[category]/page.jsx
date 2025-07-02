// src/app/product/[category]/page.jsx
import CategorySidebar from "@/components/CategorySidebar"
import Link from "next/link"
import connectMongoDB from "@/libs/mongodb"
import Polisher from "@/models/polisher"
import Pad       from "@/models/pad"
import Compound  from "@/models/compound"

async function getproductFor(category) {
  await connectMongoDB()
  switch (category) {
    case "polisher":
      return Polisher.find().lean()
    case "pad":
      return Pad.find().lean()
    case "compound":
      return Compound.find().lean()
    default:
      throw new Error("Unknown category")
  }
}

export default async function CategoryPage({ params }) {
  const { category } = await params
  let product
  try {
    product = await getproductFor(category)
  } catch {
    return <p>Category “{category}” not found</p>
  }

  const pretty = {
    polisher: "Polishers",
    pad:      "Pads",
    compound: "Compounds",
  }[category]

  return (
    <div className="flex">
      <CategorySidebar active={category} />

      <main className="flex-1 p-6 bg-purple-50 rounded-lg m-3">
        <h1 className="text-2xl mb-4">{pretty}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {product.map((item) => {
            const firstUrl = item.images?.[0]?.url || '/placeholder.png';
            return (
              <div
                key={item._id}
                className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link href={`/product/${category}/${item._id}`}>
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
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
