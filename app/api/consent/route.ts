import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Consent } from "@/lib/models";
import { AuditEvent } from "@/lib/models";

const CONSENT_TEXT =
  "I authorize the landlord and their agents to obtain my credit report and use it for tenant screening and lease qualification. I understand this is a soft inquiry for permissible purpose: tenant screening.";

const createSchema = z.object({
  applicantId: z.string().min(1),
  listingId: z.string().min(1),
  signedName: z.string().min(1),
  consentGiven: z.literal(true),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const data = createSchema.parse(body);
    if (!data.consentGiven) {
      return NextResponse.json(
        { error: "Consent must be explicitly given" },
        { status: 400 }
      );
    }
    const consent = await Consent.create({
      applicantId: data.applicantId,
      listingId: data.listingId,
      consentTextVersion: CONSENT_TEXT,
      signedName: data.signedName,
      signedAt: new Date(),
      permissiblePurpose: "tenant_screening",
    });
    await AuditEvent.create({
      type: "CONSENT_SIGNED",
      actor: "tenant",
      metadata: {
        consentId: consent._id,
        applicantId: data.applicantId,
        listingId: data.listingId,
        signedAt: consent.signedAt,
      },
    });
    return NextResponse.json({
      consentId: consent._id,
      signedAt: consent.signedAt,
      permissiblePurpose: consent.permissiblePurpose,
    });
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

export async function GET() {
  return NextResponse.json({ consentText: CONSENT_TEXT });
}
