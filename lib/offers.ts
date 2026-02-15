import { Types } from "mongoose";

export type RiskBand = "A" | "B" | "C" | "D";

export interface ListingParams {
  baseRent: number;
  minDeposit: number;
  maxDeposit: number;
  minTermMonths: number;
  maxTermMonths: number;
  autopayDiscountMax: number;
}

export interface OfferBundle {
  _id?: Types.ObjectId;
  name: string;
  rent: number;
  deposit: number;
  termMonths: number;
  autopayDiscount: number;
  moveInFeeWaived?: boolean;
  notes?: string;
}

export interface GeneratedOffers {
  riskBand: RiskBand;
  limitedData: boolean;
  factors: string[];
  offers: OfferBundle[];
  recommendedOfferId: Types.ObjectId | null;
}

function inferScore(crsResponse: Record<string, unknown>): number | null {
  const a = crsResponse.score ?? crsResponse.vantageScore ?? crsResponse.riskScore;
  if (typeof a === "number") return a;
  const nested = crsResponse.consumer as Record<string, unknown> | undefined;
  if (nested && typeof nested.score === "number") return nested.score;
  return null;
}

export function getRiskBand(score: number | null): { band: RiskBand; limitedData: boolean } {
  if (score === null) return { band: "C", limitedData: true };
  if (score >= 740) return { band: "A", limitedData: false };
  if (score >= 700) return { band: "B", limitedData: false };
  if (score >= 640) return { band: "C", limitedData: false };
  return { band: "D", limitedData: false };
}

export function buildFactors(
  riskBand: RiskBand,
  score: number | null,
  limitedData: boolean
): string[] {
  const factors: string[] = [];
  if (limitedData) factors.push("Limited file: offer terms are conservative");
  if (score !== null) factors.push(`Credit-based risk band: ${riskBand}`);
  if (riskBand === "A") factors.push("Strong credit: lower deposit and best rates available");
  if (riskBand === "B") factors.push("Good credit: standard deposit and discounts");
  if (riskBand === "C") factors.push("Moderate risk: deposit at mid-range, standard terms");
  if (riskBand === "D") factors.push("Higher risk: higher deposit required within policy limits");
  return factors;
}

export function generateOffers(
  listing: ListingParams,
  crsResponse: Record<string, unknown>
): GeneratedOffers {
  const score = inferScore(crsResponse);
  const { band: riskBand, limitedData } = getRiskBand(score);
  const factors = buildFactors(riskBand, score, limitedData);

  const {
    baseRent,
    minDeposit,
    maxDeposit,
    minTermMonths,
    maxTermMonths,
    autopayDiscountMax,
  } = listing;

  const midDeposit = Math.round((minDeposit + maxDeposit) / 2);
  const termMid = Math.min(12, Math.max(minTermMonths, Math.round((minTermMonths + maxTermMonths) / 2)));

  const depositForRisk = (base: number, mult: number) =>
    Math.round(Math.min(maxDeposit, Math.max(minDeposit, base * mult)));
  const rentForRisk = (base: number, mult: number) => Math.round(base * mult);
  const discountForRisk = (max: number, mult: number) => Math.round(max * mult);

  let depositMult = 1;
  let rentMult = 1;
  let discountMult = 1;
  if (riskBand === "A") {
    depositMult = 0.85;
    discountMult = 1.1;
  } else if (riskBand === "D") {
    depositMult = 1.2;
    rentMult = 1.02;
    discountMult = 0.7;
  } else if (riskBand === "C") {
    depositMult = 1.05;
    discountMult = 0.9;
  }

  const dep = (v: number) => depositForRisk(v, depositMult);
  const rent = (v: number) => rentForRisk(v, rentMult);
  const disc = (v: number) => discountForRisk(v, discountMult);

  const bundles: OfferBundle[] = [
    {
      name: "Balanced",
      rent: rent(baseRent),
      deposit: dep(midDeposit),
      termMonths: termMid,
      autopayDiscount: disc(autopayDiscountMax),
      moveInFeeWaived: false,
      notes: "Mid deposit, standard term, autopay discount",
    },
    {
      name: "Lower Move-in",
      rent: rent(baseRent * 1.03),
      deposit: dep(minDeposit),
      termMonths: termMid,
      autopayDiscount: disc(autopayDiscountMax * 0.8),
      moveInFeeWaived: false,
      notes: "Lower deposit, slightly higher rent",
    },
    {
      name: "Lower Monthly",
      rent: rent(baseRent * 0.97),
      deposit: dep(maxDeposit * 0.9),
      termMonths: termMid,
      autopayDiscount: disc(autopayDiscountMax),
      moveInFeeWaived: false,
      notes: "Higher deposit, lower monthly rent",
    },
    {
      name: "Short Term Flex",
      rent: rent(baseRent * 1.08),
      deposit: dep(midDeposit),
      termMonths: Math.min(6, maxTermMonths),
      autopayDiscount: disc(autopayDiscountMax * 0.5),
      moveInFeeWaived: riskBand === "A",
      notes: "3–6 month term, flexibility premium",
    },
  ];

  if (riskBand === "D") {
    bundles.push({
      name: "Higher deposit option",
      rent: rent(baseRent),
      deposit: dep(maxDeposit),
      termMonths: termMid,
      autopayDiscount: disc(autopayDiscountMax * 0.5),
      moveInFeeWaived: false,
      notes: "Maximum deposit; recommended for higher risk",
    });
  }

  const balanced = bundles[0];
  const higherDeposit = bundles.find((b) => b.name === "Higher deposit option");
  const recommended =
    riskBand === "D" && higherDeposit ? higherDeposit : balanced;

  const withIds = bundles.map((b) => ({
    ...b,
    _id: new Types.ObjectId(),
  }));
  const recommendedOfferId =
    withIds.find((b) => b.name === recommended!.name)?._id ?? withIds[0]._id;

  return {
    riskBand,
    limitedData,
    factors,
    offers: withIds,
    recommendedOfferId,
  };
}

export function crsResponseSummary(crsResponse: Record<string, unknown>): Record<string, unknown> {
  const score = inferScore(crsResponse);
  const { band, limitedData } = getRiskBand(score);
  return {
    riskBand: band,
    limitedData,
    scorePresent: score !== null,
    scoreValue: score,
  };
}
