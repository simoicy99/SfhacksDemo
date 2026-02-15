import { NextResponse } from "next/server";

/**
 * GET /api/ai/models — list Anthropic models available for your API key.
 * Use the "id" from the response as ANTHROPIC_MODEL in .env if the default fails.
 */
export async function GET() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY is not set" }, { status: 500 });
  }
  try {
    const r = await fetch("https://api.anthropic.com/v1/models?limit=50", {
      headers: {
        "X-Api-Key": apiKey,
        "Anthropic-Version": "2023-06-01",
      },
    });
    if (!r.ok) {
      const text = await r.text();
      return NextResponse.json(
        { error: `Anthropic API ${r.status}: ${text}` },
        { status: r.status }
      );
    }
    const data = (await r.json()) as { data?: { id: string; display_name: string }[] };
    const models = data.data ?? [];
    return NextResponse.json({
      models: models.map((m) => ({ id: m.id, name: m.display_name })),
      current: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250929 (default)",
    });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
