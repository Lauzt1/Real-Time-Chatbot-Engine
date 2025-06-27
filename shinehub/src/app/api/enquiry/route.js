import connectMongoDB from "@/libs/mongodb";
import Enquiry       from "@/models/enquiry";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  await connectMongoDB();
  const doc = await Enquiry.create(body);
  // return the saved id if you like
  return NextResponse.json({ id: doc._id }, { status: 201 });
}

export async function GET() {
  await connectMongoDB();
  const all = await Enquiry.find().lean();
  return NextResponse.json(all);
}
