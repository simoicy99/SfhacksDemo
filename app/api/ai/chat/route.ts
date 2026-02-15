import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { chatWithClaude } from "@/lib/claude";

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = chatSchema.parse(body);
    if (messages.length === 0) {
      return NextResponse.json({ error: "At least one message required" }, { status: 400 });
    }
    const reply = await chatWithClaude(messages);
    return NextResponse.json({ message: reply });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 });
    }
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
