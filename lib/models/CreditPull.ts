import mongoose from "mongoose";

const creditPullSchema = new mongoose.Schema(
  {
    applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "Applicant", required: true },
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
    consentId: { type: mongoose.Schema.Types.ObjectId, ref: "Consent", required: true },
    bureau: { type: String, default: "experian" },
    endpoint: { type: String, default: "exp-prequal-vantage4" },
    status: { type: String, enum: ["success", "fail"], required: true },
    requestPayloadRedacted: mongoose.Schema.Types.Mixed,
    responseEncrypted: String,
    responseSummary: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const CreditPull =
  mongoose.models.CreditPull || mongoose.model("CreditPull", creditPullSchema);
