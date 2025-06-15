import connectMongoDB from "@/libs/mongodb";
import Polisher from "@/models/polisher";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    const { id } = params;
    const { 
        newName: name,
        newBackingpad: backingpad,
        newOrbit: orbit,
        newPower: power,
        newRpm: rpm,
        newWeight: weight,
        newDescription: description,
        newImageUrl: imageUrl
    } = await request.json();
    await connectMongoDB();
    await Polisher.findByIdAndUpdate(id, { name, backingpad, orbit, power, rpm, weight, description, imageUrl });
    return NextResponse.json({ message: "Polisher Added" }, { status: 200 });
}

export async function GET({ params }) {
    const { id } = params;
    await connectMongoDB();
    const polisher = await Polisher.findOne({ _id: id });
    return NextResponse.json({ polisher }, { status: 200 });
}