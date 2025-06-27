import connectMongoDB from "@/libs/mongodb";
import Faq             from "@/models/faq";
import { NextResponse } from "next/server";
import { ObjectId }    from "mongodb";

export async function GET(request) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(request.url);

    // 1) pick up ?context=<general|polisher|pad|compound> (default to general)
    const contextParam = searchParams.get("context") || "general";

    // 2) parse optional ?exclude=<comma-separated-ids>
    const excludeParam = searchParams.get("exclude") || "";
    const excludeIds = excludeParam
      .split(",")
      .filter(Boolean)
      .map((id) => {
        try { return new ObjectId(id); }
        catch { return null; }
      })
      .filter(Boolean);

    // 3) build query: filter by contexts array, then exclude clicked ones
    const query = { contexts: contextParam };
    if (excludeIds.length) {
      query._id = { $nin: excludeIds };
    }

    // 4) grab top-4 by priority, then createdAt
    const faqs = await Faq.find(query)
      .sort({ priority: 1, createdAt: 1 })
      .limit(4)
      .lean();

    // 5) only send back what the widget needs
    const payload = faqs.map((f) => ({
      id:       f._id.toString(),
      question: f.question,
      answer:   f.answer,
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
    const { question, answer, contextType, contextKey, priority } = await request.json();

    // Basic validation
    if (
      typeof question !== "string" ||
      typeof answer   !== "string" ||
      typeof contextType   !== "string"||
      typeof contextKey   !== "string" ||
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
      contextType,
      contextKey,
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
