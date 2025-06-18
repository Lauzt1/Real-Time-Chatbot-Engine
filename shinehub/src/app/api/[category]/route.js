// src/app/api/[category]/route.js
import connectMongoDB from "@/libs/mongodb";
import Polisher        from "@/models/polisher";
import Pad             from "@/models/pad";
import Compound        from "@/models/compound";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { category } = await params;
  await connectMongoDB();

  let items;
  switch (category) {
    case "polisher":
      items = await Polisher.find().lean();
      break;
    case "pad":
      items = await Pad.find().lean();
      break;
    case "compound":
      items = await Compound.find().lean();
      break;
    default:
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json(items);
}

export async function POST(request, { params }) {
  const { category } = await params;
  const data = await request.json();
  await connectMongoDB();

  let created;
  switch (category) {
    case "polisher":
      created = await Polisher.create(data);
      break;
    case "pad":
      created = await Pad.create(data);
      break;
    case "compound":
      created = await Compound.create(data);
      break;
    default:
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json(created, { status: 201 });
}
