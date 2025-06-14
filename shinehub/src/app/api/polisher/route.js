import connectMongoDB from "@/libs/mongodb";
import Polisher from "@/models/polisher"
import { NextResponse } from "next/server";

export async function POST(request) {
    const { name, backingpad, orbit, power, rpm, weight, description, imageUrl } = await request.json();
    await connectMongoDB();
    await Polisher.create({name, backingpad, orbit, power, rpm, weight, description, imageUrl});
    return NextResponse.json({ message: "Polisher Added" }, { status: 201 });
}

export async function GET() {
    await connectMongoDB();
    const polisher = await Polisher.find();
    return NextResponse.json({polisher});
}

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get('id');
    await connectMongoDB();
    await Polisher.findByIdAndDelete(id);
    return NextResponse.json({ message: "Polisher Deleted" }, { status: 200 });
}