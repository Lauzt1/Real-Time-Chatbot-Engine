import connectMongoDB from "@/libs/mongodb";
import Faq             from "@/models/faq";
import Polisher        from "@/models/polisher";
import Pad             from "@/models/pad";
import Compound        from "@/models/compound";
import { NextResponse } from "next/server";
import { ObjectId }    from "mongodb";

export async function GET(request) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(request.url);
    const contextParam = searchParams.get("context") || "general";
    const productId    = searchParams.get("id")      || "";

    // parse optional ?exclude=<comma-separated-ids>
    const excludeParam = searchParams.get("exclude") || "";
    const excludeIds = excludeParam
      .split(",")
      .filter(Boolean)
      .map((id) => {
        try { return new ObjectId(id); }
        catch { return null; }
      })
      .filter(Boolean);

    // 1a) load full product document for placeholder substitution
    let productDoc = null;
    let keyValue   = null;
    if (productId) {
      if (contextParam === "polisher") {
        productDoc = await Polisher.findById(productId).lean();
        keyValue   = productDoc?.name;
      } else if (contextParam === "pad") {
        productDoc = await Pad.findById(productId).lean();
        keyValue   = productDoc?.code;
      } else if (contextParam === "compound") {
        productDoc = await Compound.findById(productId).lean();
        keyValue   = productDoc?.code;
      }
    }

    // 2) build OR conditions
    const orConditions = [];
    if (contextParam === "general") {
      orConditions.push({ contextType: "general" });
    } else {
      const singular = contextParam;
      const plural   = `${contextParam}s`;

      // generic product-level FAQ
      orConditions.push({ contextType: singular });
      // any blank-key FAQ for this type
      orConditions.push({ contextType: plural, contextKey: "" });
      // page-specific FAQ
      if (keyValue) {
        orConditions.push({ contextType: plural, contextKey: keyValue });
      }
    }

    // 3) assemble final query, excluding clicked FAQs
    const query = { $or: orConditions };
    if (excludeIds.length) {
      query._id = { $nin: excludeIds };
    }

    // 4) fetch top-4 FAQs
    const faqs = await Faq.find(query)
      .sort({ priority: 1, createdAt: 1 })
      .limit(4)
      .lean();

    // 5) interpolate any {{field}} placeholders using productDoc
    const payload = faqs.map((f) => {
      let answer = f.answer;
      if (productDoc) {
        answer = answer.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
          const val = productDoc[key.trim()];
          return val != null ? String(val) : "";
        });
      }
      return {
        id:       f._id.toString(),
        question: f.question,
        answer,
      };
    });

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
      typeof question   !== "string" ||
      typeof answer     !== "string" ||
      typeof contextType!== "string" ||
      typeof contextKey !== "string" ||
      typeof priority   !== "number"
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
