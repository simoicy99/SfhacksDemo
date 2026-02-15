import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    landlordName: String,
    landlordEmail: String,
    address: { type: String, required: true },
    baseRent: { type: Number, required: true },
    minDeposit: { type: Number, required: true },
    maxDeposit: { type: Number, required: true },
    minTermMonths: { type: Number, required: true },
    maxTermMonths: { type: Number, required: true },
    autopayDiscountMax: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Listing =
  mongoose.models.Listing || mongoose.model("Listing", listingSchema);
