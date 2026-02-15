import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Listing, Applicant, Offer } from "@/lib/models";
import { searchMatchesWithClaude } from "@/lib/claude";

export const maxDuration = 30;

const matchSchema = z.object({
  role: z.enum(["landlord", "tenant"]),
  listingId: z.string().optional(),
  applicantId: z.string().optional(),
  criteria: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const input = matchSchema.parse(body);

    const listings = await Listing.find().lean();
    const applicants = await Applicant.find().select("-ssnHash").lean();
    const offers = await Offer.find()
      .populate("listingId", "address baseRent")
      .populate("applicantId", "firstName lastName")
      .lean();

    const response = await searchMatchesWithClaude(input, {
      listings,
      applicants,
      offers,
    });

    return NextResponse.json({ success: true, message: response });
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
