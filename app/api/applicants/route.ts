import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Applicant } from "@/lib/models";
import { ssnLast4, ssnHash } from "@/lib/ssn";

const createSchema = z.object({
  firstName: z.string().min(1),
  middleName: z.string().optional(),
  lastName: z.string().min(1),
  birthDate: z.string().min(1),
  ssn: z.string().min(9),
  currentAddress: z.object({
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
  }),
});

export async function GET() {
  try {
    await connectDB();
    const applicants = await Applicant.find()
      .select("-ssnHash")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(applicants);
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const data = createSchema.parse(body);
    const ssn = data.ssn.replace(/\D/g, "");
    const applicant = await Applicant.create({
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      birthDate: data.birthDate,
      ssnLast4: ssnLast4(ssn),
      ssnHash: ssnHash(ssn),
      currentAddress: data.currentAddress,
    });
    const out = applicant.toObject();
    delete (out as Record<string, unknown>).ssnHash;
    return NextResponse.json(out);
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
