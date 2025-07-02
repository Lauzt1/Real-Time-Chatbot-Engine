// src/app/api/faq/[id]/route.js
import connectMongoDB from "@/libs/mongodb";
import Faq from "@/models/faq";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = await params;
  await connectMongoDB();

  const faq = await Faq.findById(id).lean();
  if (!faq) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(faq);
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  await connectMongoDB();

  const updated = await Faq.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  await connectMongoDB();

  const deleted = await Faq.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 204: success, no content
  return new NextResponse(null, { status: 204 });
}
