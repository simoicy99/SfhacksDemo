import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { AuditEvent } from "@/lib/models";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const offerId = searchParams.get("offerId");
    const listingId = searchParams.get("listingId");
    const applicantId = searchParams.get("applicantId");
    const filter: Record<string, unknown> = {};
    if (offerId) filter["metadata.offerId"] = offerId;
    if (listingId) filter["metadata.listingId"] = listingId;
    if (applicantId) filter["metadata.applicantId"] = applicantId;
    const events = await AuditEvent.find(filter)
      .sort({ createdAt: 1 })
      .select("type actor metadata createdAt")
      .lean();
    return NextResponse.json(events);
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
