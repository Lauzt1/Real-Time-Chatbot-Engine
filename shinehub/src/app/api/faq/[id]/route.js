// src/app/api/faq/[id]/route.js
import connectMongoDB from "@/libs/mongodb";
import Faq        from "@/models/faq";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const { id } = params;
  await connectMongoDB();
  const deleted = await Faq.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  // 204 No Content is idiomatic for a successful delete
  return new NextResponse(null, { status: 204 });
}
