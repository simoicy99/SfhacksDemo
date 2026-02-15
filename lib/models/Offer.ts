import mongoose from "mongoose";

const offerBundleSchema = new mongoose.Schema(
  {
    name: String,
    rent: Number,
    deposit: Number,
    termMonths: Number,
    autopayDiscount: Number,
    moveInFeeWaived: Boolean,
    notes: String,
  },
  { _id: true }
);

const offerSchema = new mongoose.Schema(
  {
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
    applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "Applicant", required: true },
    creditPullId: { type: mongoose.Schema.Types.ObjectId, ref: "CreditPull", required: true },
    riskBand: { type: String, enum: ["A", "B", "C", "D"], required: true },
    factors: [String],
    limitedData: { type: Boolean, default: false },
    offers: [offerBundleSchema],
    recommendedOfferId: mongoose.Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Offer =
  mongoose.models.Offer || mongoose.model("Offer", offerSchema);
