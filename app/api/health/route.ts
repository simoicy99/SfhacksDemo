import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({
      ok: true,
      mongo: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, mongo: "error", error: (e as Error).message },
      { status: 503 }
    );
  }
}
