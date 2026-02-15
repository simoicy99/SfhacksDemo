import mongoose from "mongoose";

const auditEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "CONSENT_SIGNED",
        "CREDIT_PULL_REQUESTED",
        "CREDIT_PULL_SUCCEEDED",
        "CREDIT_PULL_FAILED",
        "OFFERS_GENERATED",
        "OFFER_VIEWED",
      ],
      required: true,
    },
    actor: { type: String, enum: ["landlord", "tenant", "system"], required: true },
    metadata: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const AuditEvent =
  mongoose.models.AuditEvent || mongoose.model("AuditEvent", auditEventSchema);
