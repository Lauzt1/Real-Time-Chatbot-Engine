// src/app/api/[category]/type/route.js
import connectMongoDB from "@/libs/mongodb"
import Polisher  from "@/models/polisher"
import Pad       from "@/models/pad"
import Compound  from "@/models/compound"
import { NextResponse } from "next/server"

async function GET(request, { params }) {
  const { category } = params
  await connectMongoDB()

  let types = []
  switch (category) {
    case "polisher":
      types = await Polisher.distinct("type")
      break
    case "pad":
      types = await Pad.distinct("type")
      break
    case "compound":
      types = await Compound.distinct("type")
      break
    default:
      return NextResponse.json({ error: "Unknown category" }, { status: 404 })
  }

  return NextResponse.json({ types })
}

export { GET }
