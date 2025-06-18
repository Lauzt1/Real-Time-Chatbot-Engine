// src/app/api/faq/route.js
import connectMongoDB from "@/libs/mongodb";
import Faq             from "@/models/faq";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();
    const faqs = await Faq.find().lean();
    return NextResponse.json(faqs);
  } catch (err) {
    console.error("Failed to fetch FAQs:", err);
    return NextResponse.json(
      { error: "Could not load FAQs" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { question, answer, contexts, priority } = await request.json();

    // Basic validation
    if (
      typeof question !== "string" ||
      typeof answer   !== "string" ||
      !Array.isArray(contexts) ||
      typeof priority !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    await connectMongoDB();
    const created = await Faq.create({
      question,
      answer,
      contexts,
      priority,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("Failed to create FAQ:", err);
    return NextResponse.json(
      { error: "Could not create FAQ" },
      { status: 500 }
    );
  }
}
