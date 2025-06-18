// src/app/api/message/route.js
import connectMongoDB from "@/libs/mongodb";
import Message        from "@/models/message";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongoDB();
  const messages = await Message.find().lean();
  return NextResponse.json(messages);
}

export async function POST(request) {
  const data = await request.json();
  await connectMongoDB();
  const created = await Message.create(data);
  return NextResponse.json(created, { status: 201 });
}
