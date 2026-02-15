"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface OfferBundle {
  _id?: string;
  id?: string;
  name: string;
  rent: number;
  deposit: number;
  termMonths: number;
  autopayDiscount: number;
  moveInFeeWaived?: boolean;
  notes?: string;
}

interface OfferDoc {
  _id: string;
  listingId: { address?: string; baseRent?: number };
  applicantId: { firstName?: string; lastName?: string };
  riskBand: string;
  limitedData?: boolean;
  factors: string[];
  offers: OfferBundle[];
  recommendedOfferId: string;
}

interface AuditEvent {
  type: string;
  actor: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export default function OfferPage({
  params,
}: {
  params: { offerId: string };
}) {
  const offerId = params.offerId;
  const [offer, setOffer] = useState<OfferDoc | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [audit, setAudit] = useState<AuditEvent[]>([]);
  const [openWhy, setOpenWhy] = useState(false);
  const [openAudit, setOpenAudit] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/offers/${offerId}`);
      if (cancelled) return;
      setLoaded(true);
      if (!res.ok) setOffer(null);
      else setOffer(await res.json());
    })();
    return () => { cancelled = true; };
  }, [offerId]);

  useEffect(() => {
    if (!offerId) return;
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/audit?offerId=${offerId}`);
      if (cancelled) return;
      if (res.ok) setAudit(await res.json());
    })();
    return () => { cancelled = true; };
  }, [offerId]);

  if (!loaded) {
    return (
      <div className="page-container flex items-center justify-center min-h-[40vh]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <span className="inline-block w-8 h-8 rounded-full border-2 border-slate-300 border-t-green-500 animate-spin" aria-hidden />
          <span>Loading…</span>
        </div>
      </div>
    );
  }
  if (!offer) {
    return (
      <div className="page-container">
        <p className="text-slate-600">Offer not found.</p>
        <Link href="/demo/applicant" className="back-link mt-4 inline-block">← Back to applicant</Link>
      </div>
    );
  }

  const recommendedId = offer.recommendedOfferId?.toString?.() ?? offer.recommendedOfferId;
  const bundles = offer.offers || [];

  return (
    <div className="page-container max-w-3xl">
      <Link href="/demo/applicant" className="back-link">
        <span aria-hidden>←</span> Back to applicant
      </Link>

      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-slate-800">Your offer menu</h1>
        <p className="text-slate-600 text-sm mt-1">
          {offer.applicantId && (
            <>Applicant: {offer.applicantId.firstName} {offer.applicantId.lastName}</>
          )}
          {offer.listingId?.address && <> · {offer.listingId.address}</>}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {bundles.map((b) => {
          const id = (b._id ?? b.id)?.toString();
          const isRecommended = id === recommendedId;
          return (
            <div
              key={id ?? b.name}
              className={`card p-5 transition-all ${
                isRecommended
                  ? "ring-2 ring-green-500 bg-green-50/60 border-green-200"
                  : "hover:border-slate-300"
              }`}
            >
              {isRecommended && (
                <span className="inline-block text-xs font-semibold text-green-700 bg-green-200/80 px-2.5 py-1 rounded-lg mb-3">
                  Recommended
                </span>
              )}
              <h3 className="font-semibold text-slate-800 text-lg">{b.name}</h3>
              <ul className="mt-3 text-sm text-slate-600 space-y-1.5">
                <li><span className="text-slate-500">Rent</span> ${b.rent}/mo</li>
                <li><span className="text-slate-500">Deposit</span> ${b.deposit}</li>
                <li><span className="text-slate-500">Term</span> {b.termMonths} months</li>
                <li><span className="text-slate-500">Autopay discount</span> ${b.autopayDiscount}/mo</li>
                {b.moveInFeeWaived && <li className="text-green-600">Move-in fee waived</li>}
              </ul>
              {b.notes && <p className="mt-3 text-xs text-slate-500">{b.notes}</p>}
            </div>
          );
        })}
      </div>

      <section className="card mt-8 overflow-hidden">
        <button
          type="button"
          onClick={() => setOpenWhy(!openWhy)}
          className="w-full px-5 py-4 text-left font-medium text-slate-800 flex justify-between items-center hover:bg-slate-50/80 transition"
        >
          Why this menu?
          <span className="text-slate-400 text-sm" aria-hidden>{openWhy ? "▼" : "▶"}</span>
        </button>
        {openWhy && (
          <div className="px-5 py-4 border-t border-slate-200 bg-slate-50/50 space-y-2">
            <p className="text-sm">
              <strong className="text-slate-700">Risk band:</strong> {offer.riskBand}
              {offer.limitedData && " (limited data)"}
            </p>
            <p className="text-sm text-slate-600">Factors that influenced the menu:</p>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-0.5">
              {(offer.factors || []).map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="card mt-4 overflow-hidden">
        <button
          type="button"
          onClick={() => setOpenAudit(!openAudit)}
          className="w-full px-5 py-4 text-left font-medium text-slate-800 flex justify-between items-center hover:bg-slate-50/80 transition"
        >
          Audit log
          <span className="text-slate-400 text-sm" aria-hidden>{openAudit ? "▼" : "▶"}</span>
        </button>
        {openAudit && (
          <div className="px-5 py-4 border-t border-slate-200 bg-slate-50/50">
            <ul className="space-y-2 text-sm">
              {audit.map((ev, i) => (
                <li key={i} className="flex flex-wrap gap-2 items-baseline">
                  <span className="font-mono text-xs text-slate-500">
                    {new Date(ev.createdAt).toISOString()}
                  </span>
                  <span className="font-medium text-slate-700">{ev.type}</span>
                  <span className="text-slate-500">({ev.actor})</span>
                  {ev.metadata && Object.keys(ev.metadata).length > 0 && (
                    <span className="text-slate-400 text-xs truncate max-w-full">
                      {JSON.stringify(ev.metadata)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            {audit.length === 0 && <p className="text-slate-500 text-sm">No events yet.</p>}
          </div>
        )}
      </section>

      <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
        <strong className="text-slate-800">Compliance:</strong> Consent recorded; request ID and timestamp stored. Permissible purpose: tenant screening. No full SSN stored.
      </div>
    </div>
  );
}
