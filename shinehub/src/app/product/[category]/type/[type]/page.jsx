import CategorySidebar from "@/components/CategorySidebar"
import Link from "next/link"
import connectMongoDB from "@/libs/mongodb"
import Polisher from "@/models/polisher"
import Pad from "@/models/pad"
import Compound from "@/models/compound"

function getModel(category) {
  switch (category) {
    case "polisher": return Polisher
    case "pad":      return Pad
    case "compound": return Compound
    default:         throw new Error("Unknown category")
  }
}

export default async function TypePage({ params }) {
  const { category, type } = params
  const formattedType = type.replace(/_/g, ' ')

  await connectMongoDB()

  const Model = getModel(category)
  const items = await Model.find({ type: formattedType }).lean()

  const pretty = {
    polisher: "Polishers",
    pad: "Pads",
    compound: "Compounds",
  }[category]

  return (
    <div className="flex">
      <CategorySidebar active={category} filter={formattedType} />

      <main className="flex-1 p-6 bg-purple-50">
        <h1 className="text-2xl mb-4">
          {pretty} : {formattedType.charAt(0).toUpperCase() + formattedType.slice(1)}
        </h1>

        <div className="grid grid-cols-3 gap-6">
          {items.map((item) => {
            const firstUrl = item.images?.[0]?.url || "/placeholder.png"
            return (
              <div
                key={item._id}
                className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link href={`/product/${category}/${item._id}`}>
                  <img
                    src={firstUrl}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
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
