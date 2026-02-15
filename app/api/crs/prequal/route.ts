import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Applicant, Consent, Listing, CreditPull, Offer, AuditEvent } from "@/lib/models";
import { requestPrequal, type PrequalPayload } from "@/lib/crsClient";
import { ssnLast4, ssnHash } from "@/lib/ssn";
import { encrypt } from "@/lib/encryption";
import { generateOffers, crsResponseSummary } from "@/lib/offers";
import mongoose from "mongoose";

const prequalSchema = z.object({
  applicantId: z.string(),
  listingId: z.string(),
  consentId: z.string(),
  signedAt: z.string(), // ISO date string
  ssn: z.string().min(9),
});

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET;
const storeEncrypted = !!ENCRYPTION_SECRET && ENCRYPTION_SECRET.length >= 32;

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const parsed = prequalSchema.parse(body);

    const consent = await Consent.findOne({
      _id: parsed.consentId,
      applicantId: parsed.applicantId,
      listingId: parsed.listingId,
    });
    if (!consent) {
      return NextResponse.json(
        { error: "Consent record not found or does not match" },
        { status: 400 }
      );
    }
    const signedAt = new Date(parsed.signedAt);
    if (isNaN(signedAt.getTime()) || Math.abs(signedAt.getTime() - consent.signedAt.getTime()) > 60000) {
      return NextResponse.json(
        { error: "Invalid or expired consent timestamp" },
        { status: 400 }
      );
    }

    const applicant = await Applicant.findById(parsed.applicantId);
    const listing = await Listing.findById(parsed.listingId);
    if (!applicant || !listing) {
      return NextResponse.json(
        { error: "Applicant or listing not found" },
        { status: 404 }
      );
    }

    const ssnNormalized = parsed.ssn.replace(/\D/g, "");
    if (applicant.ssnLast4 !== ssnLast4(ssnNormalized) || applicant.ssnHash !== ssnHash(ssnNormalized)) {
      return NextResponse.json(
        { error: "SSN does not match applicant record" },
        { status: 400 }
      );
    }

    await AuditEvent.create({
      type: "CREDIT_PULL_REQUESTED",
      actor: "tenant",
      metadata: {
        applicantId: parsed.applicantId,
        listingId: parsed.listingId,
        consentId: parsed.consentId,
        permissiblePurpose: "tenant_screening",
      },
    });

    const payload: PrequalPayload = {
      firstName: applicant.firstName,
      middleName: applicant.middleName,
      lastName: applicant.lastName,
      birthDate: applicant.birthDate,
      ssn: ssnNormalized,
      address: {
        line1: applicant.currentAddress.line1,
        line2: applicant.currentAddress.line2,
        city: applicant.currentAddress.city,
        state: applicant.currentAddress.state,
        postalCode: applicant.currentAddress.postalCode,
      },
    };

    let crsResponse: unknown;
    try {
      crsResponse = await requestPrequal(payload);
    } catch (e) {
      await AuditEvent.create({
        type: "CREDIT_PULL_FAILED",
        actor: "system",
        metadata: { error: (e as Error).message },
      });
      return NextResponse.json(
        { error: "Credit prequal request failed", detail: (e as Error).message },
        { status: 502 }
      );
    }

    const responseObj = typeof crsResponse === "object" && crsResponse !== null ? (crsResponse as Record<string, unknown>) : { raw: crsResponse };
    const summary = crsResponseSummary(responseObj);

    const requestPayloadRedacted = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      birthDate: payload.birthDate,
      ssnLast4: ssnLast4(ssnNormalized),
      address: payload.address,
    };

    let responseEncrypted: string | undefined;
    let responseSummary: Record<string, unknown> | undefined;
    if (storeEncrypted && ENCRYPTION_SECRET) {
      responseEncrypted = encrypt(JSON.stringify(crsResponse), ENCRYPTION_SECRET);
    } else {
      responseSummary = summary;
    }

    const creditPull = await CreditPull.create({
      applicantId: parsed.applicantId,
      listingId: parsed.listingId,
      consentId: parsed.consentId,
      bureau: "experian",
      endpoint: "exp-prequal-vantage4",
      status: "success",
      requestPayloadRedacted,
      responseEncrypted,
      responseSummary,
    });

    await AuditEvent.create({
      type: "CREDIT_PULL_SUCCEEDED",
      actor: "system",
      metadata: {
        creditPullId: creditPull._id,
        requestId: creditPull._id,
        timestamp: new Date().toISOString(),
        permissiblePurpose: "tenant_screening",
      },
    });

    const listingParams = {
      baseRent: listing.baseRent,
      minDeposit: listing.minDeposit,
      maxDeposit: listing.maxDeposit,
      minTermMonths: listing.minTermMonths,
      maxTermMonths: listing.maxTermMonths,
      autopayDiscountMax: listing.autopayDiscountMax,
    };
    const generated = generateOffers(listingParams, responseObj);

    const offerDoc = await Offer.create({
      listingId: parsed.listingId,
      applicantId: parsed.applicantId,
      creditPullId: creditPull._id,
      riskBand: generated.riskBand,
      factors: generated.factors,
      limitedData: generated.limitedData,
      offers: generated.offers,
      recommendedOfferId: generated.recommendedOfferId,
    });

    await AuditEvent.create({
      type: "OFFERS_GENERATED",
      actor: "system",
      metadata: {
        offerId: offerDoc._id,
        listingId: parsed.listingId,
        applicantId: parsed.applicantId,
        riskBand: generated.riskBand,
      },
    });

    const normalized = {
      riskBand: generated.riskBand,
      limitedData: generated.limitedData,
      factors: generated.factors,
      offers: generated.offers.map((o) => ({
        id: o._id?.toString(),
        name: o.name,
        rent: o.rent,
        deposit: o.deposit,
        termMonths: o.termMonths,
        autopayDiscount: o.autopayDiscount,
        moveInFeeWaived: o.moveInFeeWaived,
        notes: o.notes,
      })),
      recommendedOfferId: generated.recommendedOfferId?.toString(),
      offerId: offerDoc._id.toString(),
      compliance: {
        consentId: parsed.consentId,
        signedAt: consent.signedAt.toISOString(),
        requestId: creditPull._id.toString(),
        timestamp: new Date().toISOString(),
        permissiblePurpose: "tenant_screening",
      },
    };

    return NextResponse.json(normalized);
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
