import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { chatWithClaude } from "@/lib/claude";

export const maxDuration = 30;

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
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        message: "Chat is not configured for this deployment. To enable it, add ANTHROPIC_API_KEY in your Vercel project settings (Settings → Environment Variables). You can still try the full demo: Start demo → Create listing → Get my offers.",
      });
    }
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
    const msg = (e as Error).message;
    const msgLower = msg.toLowerCase();
    // Connection/timeout errors on Vercel serverless: return friendly message so the app doesn't look broken
    if (msgLower.includes("connection") || msgLower.includes("econnrefused") || msgLower.includes("etimedout") || msgLower.includes("fetch") || msgLower.includes("network")) {
      return NextResponse.json({
        message: "Chat is temporarily unavailable. You can still try the full demo: Start demo → Create listing → Get my offers.",
      });
    }
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
