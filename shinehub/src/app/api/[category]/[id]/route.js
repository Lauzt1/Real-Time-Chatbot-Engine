import connectMongoDB from "@/libs/mongodb";
import Polisher        from "@/models/polisher";
import Pad             from "@/models/pad";
import Compound        from "@/models/compound";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { category, id } = params;
  await connectMongoDB();

  let item;
  switch (category) {
    case "polisher":
      item = await Polisher.findById(id).lean();
      break;
    case "pad":
      item = await Pad.findById(id).lean();
      break;
    case "compound":
      item = await Compound.findById(id).lean();
      break;
    default:
      return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(item);
}

export async function PUT(request, { params }) {
  const { category, id } = params;
  const updates = await request.json();
  await connectMongoDB();

  let updated;
  switch (category) {
    case "polisher":
      updated = await Polisher.findByIdAndUpdate(id, updates, { new: true }).lean();
      break;
    case "pad":
      updated = await Pad.findByIdAndUpdate(id, updates, { new: true }).lean();
      break;
    case "compound":
      updated = await Compound.findByIdAndUpdate(id, updates, { new: true }).lean();
      break;
    default:
      return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(request, { params }) {
  const { category, id } = params;
  await connectMongoDB();

  let deleted;
  switch (category) {
    case "polisher":
      deleted = await Polisher.findByIdAndDelete(id);
      break;
    case "pad":
      deleted = await Pad.findByIdAndDelete(id);
      break;
    case "compound":
      deleted = await Compound.findByIdAndDelete(id);
      break;
    default:
      return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
