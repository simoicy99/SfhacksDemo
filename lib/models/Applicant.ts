import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    middleName: String,
    lastName: { type: String, required: true },
    birthDate: { type: String, required: true },
    ssnLast4: { type: String, required: true },
    ssnHash: { type: String, required: true },
    currentAddress: {
      line1: { type: String, required: true },
      line2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export const Applicant =
  mongoose.models.Applicant || mongoose.model("Applicant", applicantSchema);
