/**
 * Seed script: creates one listing and one applicant (no full SSN).
 * Run: pnpm seed
 * Requires MONGODB_URI in env.
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Listing, Applicant } from "../lib/models";
import { ssnLast4, ssnHash } from "../lib/ssn";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/forward-demo";

async function seed() {
  await mongoose.connect(MONGODB_URI);
  const listing = await Listing.create({
    landlordName: "Demo Landlord",
    landlordEmail: "landlord@example.com",
    address: "456 Demo St, San Francisco, CA",
    baseRent: 2800,
    minDeposit: 1400,
    maxDeposit: 5600,
    minTermMonths: 3,
    maxTermMonths: 12,
    autopayDiscountMax: 50,
  });
  const applicant = await Applicant.create({
    firstName: "Kylia",
    lastName: "Paolimelli",
    birthDate: "1990-01-15",
    ssnLast4: ssnLast4("666001234"),
    ssnHash: ssnHash("666001234"),
    currentAddress: {
      line1: "123 Test Ave",
      city: "San Francisco",
      state: "CA",
      postalCode: "94102",
    },
  });
  console.log("Created listing:", listing._id);
  console.log("Created applicant:", applicant._id);
  console.log("Done. Use the app: create a listing or use this listing ID in sessionStorage as demoListingId for applicant flow.");
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
