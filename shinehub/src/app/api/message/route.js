import connectMongoDB from "@/libs/mongodb";
import Message from "@/models/message";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { name, email, phoneNumber, companyName, message } = await request.json();
    await connectMongoDB();
    await Message.create({name, email, phoneNumber, companyName, message});
    return NextResponse.json({ message: "Message Sent" }, { status: 201 });
}

export async function GET() {
    await connectMongoDB();
    const message = await Message.find();
    return NextResponse.json({message});
}

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get('id');
    await connectMongoDB();
    await Message.findByIdAndDelete(id);
    return NextResponse.json({ message: "Message deleted" }, { status: 200 });
}