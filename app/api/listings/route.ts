import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Listing } from "@/lib/models";

const createSchema = z.object({
  landlordName: z.string().optional(),
  landlordEmail: z.string().email().optional().or(z.literal("")),
  address: z.string().min(1),
  baseRent: z.number().positive(),
  minDeposit: z.number().min(0),
  maxDeposit: z.number().min(0),
  minTermMonths: z.number().int().min(1),
  maxTermMonths: z.number().int().min(1),
  autopayDiscountMax: z.number().min(0),
});

export async function GET() {
  try {
    await connectDB();
    const listings = await Listing.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(listings);
  } catch (e) {
    const msg = (e as Error).message;
    if (msg.includes("MONGODB_URI")) {
      return NextResponse.json(
        { error: "Database not configured. Add MONGODB_URI in Vercel (Settings → Environment Variables), then redeploy." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const data = createSchema.parse(body);
    const listing = await Listing.create(data);
    return NextResponse.json(listing);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 });
    }
    const msg = (e as Error).message;
    if (msg.includes("MONGODB_URI")) {
      return NextResponse.json(
        { error: "Database not configured. Add MONGODB_URI in Vercel (Settings → Environment Variables), then redeploy." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
