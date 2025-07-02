// src/app/api/[category]/[id]/route.js
import { v2 as cloudinary } from 'cloudinary';
import connectMongoDB from "@/libs/mongodb";
import Polisher        from "@/models/polisher";
import Pad             from "@/models/pad";
import Compound        from "@/models/compound";
import { NextResponse } from "next/server";

// configure Cloudinary
cloudinary.config({
  cloud_name:    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:       process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret:    process.env.CLOUDINARY_API_SECRET,
});

async function getModel(category) {
  switch (category) {
    case "polisher":
    case "polishers":
      return Polisher;
    case "pad":
    case "pads":
      return Pad;
    case "compound":
    case "compounds":
      return Compound;
    default:
      throw new Error(`Unknown category: ${category}`);
  }
}

export async function GET(request, { params }) {
  const { category, id } = await params;
  console.log("API /api/[category]/[id] hit with category:", category);
  await connectMongoDB();

  const Model = await getModel(category);
  const item = await Model.findById(id).lean();
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(item);
}

export async function PUT(request, { params }) {
  const { category, id } = await params;
  const updates = await request.json();
  await connectMongoDB();

  const Model = await getModel(category);
  const updated = await Model.findByIdAndUpdate(id, updates, { new: true }).lean();
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(request, { params }) {
  const { category, id } = await params;
  await connectMongoDB();

  const Model = await getModel(category);
  // fetch the item to get its images
  const item = await Model.findById(id);
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // remove each image from Cloudinary
  if (Array.isArray(item.images)) {
    await Promise.all(
      item.images.map(({ publicId }) =>
        cloudinary.uploader.destroy(publicId)
      )
    );
  }

  // delete the database record
  await Model.findByIdAndDelete(id);

  return new NextResponse(null, { status: 204 });
}
