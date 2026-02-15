import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Offer } from "@/lib/models";
import { AuditEvent } from "@/lib/models";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ offerId: string }> }
) {
  try {
    await connectDB();
    const { offerId } = await params;
    const offer = await Offer.findById(offerId)
      .populate("listingId", "address baseRent")
      .populate("applicantId", "firstName lastName")
      .populate("creditPullId", "requestPayloadRedacted responseSummary createdAt")
      .lean();
    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }
    await AuditEvent.create({
      type: "OFFER_VIEWED",
      actor: "landlord",
      metadata: { offerId },
    });
    return NextResponse.json(offer);
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
