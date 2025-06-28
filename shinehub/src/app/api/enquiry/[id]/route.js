// src/app/api/enquiry/[id]/route.js
import connectMongoDB from "@/libs/mongodb";
import Enquiry       from "@/models/enquiry";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await connectMongoDB();
  const e = await Enquiry.findById(params.id).lean();
  if (!e) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(e);
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  await connectMongoDB();
  const updated = await Enquiry.findByIdAndUpdate(
    id,
    { status: body.status },
    { new: true, runValidators: true }
  ).lean();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(request, { params }) {
  await connectMongoDB();
  const del = await Enquiry.findByIdAndDelete(params.id);
  if (!del) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
