// src/app/api/faq/route.js

import connectMongoDB from "@/libs/mongodb";
import Faq             from "@/models/faq";
import { NextResponse } from "next/server";
import { ObjectId }    from "mongodb";

export async function GET(request) {
  try {
    await connectMongoDB();

    // parse optional "exclude" query param
    const { searchParams } = new URL(request.url);
    const excludeParam = searchParams.get("exclude") || "";
    const excludeIds = excludeParam
      .split(",")
      .filter(Boolean)
      .map((id) => {
        try {
          return new ObjectId(id);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    // build query: no context filter, just exclude clicked IDs
    const query = {};
    if (excludeIds.length) {
      query._id = { $nin: excludeIds };
    }

    // fetch top 4 by priority then createdAt
    const faqs = await Faq.find(query)
      .sort({ priority: 1, createdAt: 1 })
      .limit(4)
      .lean();

    // return only id, question, answer
    const payload = faqs.map((f) => ({
      id: f._id.toString(),
      question: f.question,
      answer: f.answer,
    }));

    return NextResponse.json(payload);
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
