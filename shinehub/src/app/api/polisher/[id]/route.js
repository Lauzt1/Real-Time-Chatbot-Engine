import connectMongoDB from "@/libs/mongodb";
import Polisher from "@/models/polisher";
import { NextResponse } from "next/server";

export async function GET({ params }) {
    const { id } = params;
    await connectMongoDB();
    const polisher = await Polisher.findOne({ _id: id });
    return NextResponse.json({ polisher }, { status: 200 });
}