import mongoose from "mongoose";

const consentSchema = new mongoose.Schema(
  {
    applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "Applicant", required: true },
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
    consentTextVersion: { type: String, required: true },
    signedName: { type: String, required: true },
    signedAt: { type: Date, required: true },
    ipAddress: String,
    permissiblePurpose: { type: String, default: "tenant_screening" },
  },
  { timestamps: true }
);

export const Consent =
  mongoose.models.Consent || mongoose.model("Consent", consentSchema);
