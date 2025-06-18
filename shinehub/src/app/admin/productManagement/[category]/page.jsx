// src/app/admin/productManagement/[category]/page.jsx
import CategorySidebar from "@/components/admin/CategorySidebar"
import Link from "next/link"

// import your models (or your helper functions that call your /api routes)
import Polisher from "@/models/polisher"
import Pad       from "@/models/pad"
import Compound  from "@/models/compound"
import RemoveBtn from "@/components/admin/RemoveBtn"
import { HiPencilAlt } from 'react-icons/hi';

async function getproductFor(category) {
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

      <main className="flex-1 p-6 bg-purple-50">
        <h1 className="text-2xl mb-4">{pretty}</h1>

        <Link
          href={`/admin/productManagement/${category}/add`}
          className="mb-6 inline-block bg-purple px-4 py-2 rounded shadow"
        >
          Add {pretty.slice(0, -1)}
        </Link>

        <div className="grid grid-cols-3 gap-6">
          {product.map((item) => (
            <div key={item._id} className="bg-white border rounded-lg overflow-hidden">
              <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-4 text-center">
                <h2 className="font-medium">{item.name}</h2>
              </div>
              <div className="flex justify-center gap-4 p-2">
                <RemoveBtn id={item._id} resource={category} />
                <Link href={`/admin/productManagement/${category}/edit/${item._id}`}>
                  <HiPencilAlt size={23} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
