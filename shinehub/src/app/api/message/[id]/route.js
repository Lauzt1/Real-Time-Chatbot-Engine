// src/app/api/message/[id]/route.js
import connectMongoDB from "@/libs/mongodb";
import Message        from "@/models/message";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const { id } = await params;
  await connectMongoDB();
  const deleted = await Message.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
