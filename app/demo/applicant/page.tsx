"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CONSENT_TEXT =
  "I authorize the landlord and their agents to obtain my credit report and use it for tenant screening and lease qualification. I understand this is a soft inquiry for permissible purpose: tenant screening.";

const SANDBOX_SAMPLE = {
  firstName: "Kylia",
  middleName: "",
  lastName: "Paolimelli",
  birthDate: "1990-01-15",
  ssn: "666-00-1234",
  currentAddress: {
    line1: "123 Test Ave",
    line2: "",
    city: "San Francisco",
    state: "CA",
    postalCode: "94102",
  },
};

export default function ApplicantPage() {
  const router = useRouter();
  const [listingId, setListingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [yourName, setYourName] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [form, setForm] = useState(SANDBOX_SAMPLE);

  useEffect(() => {
    const id = typeof window !== "undefined" ? sessionStorage.getItem("demoListingId") : null;
    setListingId(id);
  }, []);

  const signedName = yourName.trim() || `${form.firstName} ${form.lastName}`;
  const displayFirstName = yourName.trim() ? yourName.split(/\s+/)[0] || form.firstName : form.firstName;
  const displayLastName = yourName.trim() ? yourName.split(/\s+/).slice(1).join(" ") || form.lastName : form.lastName;

  const handlePrequal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listingId) {
      alert("No listing set. Start from the listing page first.");
      return;
    }
    if (!consentGiven) {
      alert("Please check the consent box to continue.");
      return;
    }
    setLoading(true);
    try {
      const applicantPayload = {
        firstName: displayFirstName,
        middleName: form.middleName || undefined,
        lastName: displayLastName,
        birthDate: form.birthDate,
        ssn: form.ssn,
        currentAddress: form.currentAddress,
      };
      const applicantRes = await fetch("/api/applicants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicantPayload),
      });
      if (!applicantRes.ok) {
        const err = await applicantRes.json();
        throw new Error(err.error?.message || err.error || applicantRes.statusText);
      }
      const applicant = await applicantRes.json();

      const consentRes = await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicantId: applicant._id,
          listingId,
          signedName: signedName.trim(),
          consentGiven: true,
        }),
      });
      if (!consentRes.ok) {
        const err = await consentRes.json();
        throw new Error(err.error?.message || err.error || "Consent failed");
      }
      const consentData = await consentRes.json();

      const prequalRes = await fetch("/api/crs/prequal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicantId: applicant._id,
          listingId,
          consentId: consentData.consentId,
          signedAt: consentData.signedAt,
          ssn: form.ssn,
        }),
      });
      if (!prequalRes.ok) {
        const err = await prequalRes.json();
        throw new Error(err.detail || err.error?.message || err.error || "Prequal failed");
      }
      const result = await prequalRes.json();
      router.push(`/demo/offers/${result.offerId}`);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Link href="/demo/listing" className="back-link">
        <span aria-hidden>←</span> Back to listing
      </Link>

      <div className="card p-6 sm:p-8 mb-6 max-w-lg">
        <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Demo mode</p>
        <h1 className="font-heading text-2xl font-bold text-slate-800 mb-2">Get your offer menu</h1>
        <p className="text-slate-600 text-sm mb-6">
          We use sandbox data for the credit check. Enter your name (or a reference number) so we can personalize the experience—everything else is pre-filled for the demo.
        </p>

        <div className="rounded-xl bg-slate-50/80 border border-slate-200 p-4 mb-6">
          <p className="text-xs font-medium text-slate-500 mb-1.5">Using sandbox data</p>
          <p className="text-sm text-slate-600">
            Applicant: {SANDBOX_SAMPLE.firstName} {SANDBOX_SAMPLE.lastName} · DOB, SSN, and address are fixed for the demo.
          </p>
        </div>

        <form onSubmit={handlePrequal} className="space-y-5">
          <div>
            <label className="label">Your name (for this demo)</label>
            <input
              type="text"
              className="input-field"
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
              placeholder="e.g. Alex Smith"
            />
            <p className="text-xs text-slate-500 mt-1">Used as your signature and display name. Leave blank to use sandbox name.</p>
          </div>
          <div>
            <label className="label">Reference number (optional)</label>
            <input
              type="text"
              className="input-field"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="e.g. phone or application ID"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{CONSENT_TEXT}</p>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="rounded border-slate-300 text-green-600 focus:ring-green-500 focus:ring-offset-0"
              />
              <span className="text-sm font-medium text-slate-700">I have read and agree (required)</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !listingId}
            className="w-full py-3.5 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition"
          >
            {loading ? "Getting your offers…" : "Get my offers"}
          </button>
        </form>
      </div>

      {!listingId && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 max-w-lg">
          No listing set. <Link href="/demo/listing" className="font-medium text-amber-700 underline hover:no-underline">Create a listing</Link> first, then return here.
        </p>
      )}
    </div>
  );
}
