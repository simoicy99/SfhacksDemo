"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const DEMO_LISTING = {
  landlordName: "Demo Landlord",
  landlordEmail: "",
  address: "456 Demo St, San Francisco, CA",
  baseRent: 2800,
  minDeposit: 1400,
  maxDeposit: 5600,
  minTermMonths: 3,
  maxTermMonths: 12,
  autopayDiscountMax: 50,
};

export default function ListingPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(DEMO_LISTING);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          landlordEmail: form.landlordEmail || undefined,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const listing = await res.json();
      if (typeof window !== "undefined") {
        sessionStorage.setItem("demoListingId", listing._id);
      }
      router.push("/demo/applicant");
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <Link href="/" className="back-link">
        <span aria-hidden>←</span> Home
      </Link>

      <div className="card p-6 sm:p-8 max-w-xl">
        <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Step 1</p>
        <h1 className="font-heading text-2xl font-bold text-slate-800 mb-2">Create listing</h1>
        <p className="text-slate-600 text-sm mb-6">
          Set the property and rent rules. Defaults are pre-filled for a quick demo.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Property address</label>
            <input
              type="text"
              required
              className="input-field"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="123 Main St, City, State"
            />
          </div>
          <div>
            <label className="label">Base rent ($/month)</label>
            <input
              type="number"
              required
              min={1}
              className="input-field"
              value={form.baseRent}
              onChange={(e) => setForm((f) => ({ ...f, baseRent: Number(e.target.value) }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Min deposit ($)</label>
              <input
                type="number"
                required
                min={0}
                className="input-field"
                value={form.minDeposit}
                onChange={(e) => setForm((f) => ({ ...f, minDeposit: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="label">Max deposit ($)</label>
              <input
                type="number"
                required
                min={0}
                className="input-field"
                value={form.maxDeposit}
                onChange={(e) => setForm((f) => ({ ...f, maxDeposit: Number(e.target.value) }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Min term (months)</label>
              <input
                type="number"
                required
                min={1}
                className="input-field"
                value={form.minTermMonths}
                onChange={(e) => setForm((f) => ({ ...f, minTermMonths: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="label">Max term (months)</label>
              <input
                type="number"
                required
                min={1}
                className="input-field"
                value={form.maxTermMonths}
                onChange={(e) => setForm((f) => ({ ...f, maxTermMonths: Number(e.target.value) }))}
              />
            </div>
          </div>
          <div>
            <label className="label">Max autopay discount ($/month)</label>
            <input
              type="number"
              required
              min={0}
              className="input-field"
              value={form.autopayDiscountMax}
              onChange={(e) => setForm((f) => ({ ...f, autopayDiscountMax: Number(e.target.value) }))}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 sm:flex-none disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save & continue to applicant"}
            </button>
            <Link href="/demo/applicant" className="btn-secondary text-center sm:flex-none">
              Skip to applicant
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
