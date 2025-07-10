// app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4", // or "gpt-3.5-turbo"
      messages: [{ role: "user", content: prompt }],
    });

    const message = completion.choices[0].message.content;

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
