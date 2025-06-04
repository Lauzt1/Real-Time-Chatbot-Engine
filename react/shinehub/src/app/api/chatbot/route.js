// /src/app/api/chatbot/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  // Parse the JSON body (same shape as before)
  const { sender, message, metadata } = await request.json();

  // Forward to Rasa REST webhook
  const rasaResponse = await fetch(
    `${process.env.NEXT_PUBLIC_RASA_URL}/webhooks/rest/webhook`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender, message, metadata }),
    }
  );

  const botMessages = await rasaResponse.json();
  return NextResponse.json(botMessages);
}
