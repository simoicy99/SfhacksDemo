"use client";

import Link from "next/link";

export default function MatchPage() {
  return (
    <div className="page-container">
      <Link href="/" className="back-link">
        <span aria-hidden>←</span> Home
      </Link>

      <div className="card p-6 sm:p-8 max-w-2xl">
        <h1 className="font-heading text-2xl font-bold text-slate-800 mb-4">
          Find compatible roommates, tenants, or listings
        </h1>
        <div className="rounded-xl bg-green-50/80 border border-green-200/80 p-5 mb-6">
          <p className="text-slate-700 font-medium mb-2">Just talk to the AI.</p>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Go to the home page and ask in plain language. The AI can search your sandbox data and suggest compatible matches—no forms required.
          </p>
          <p className="text-slate-600 text-sm mb-4">
            Try saying:
          </p>
          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 mb-4">
            <li>“Find me compatible tenants”</li>
            <li>“I’m a tenant—what listings match me?”</li>
            <li>“Suggest roommates for my listing”</li>
          </ul>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-500 transition"
          >
            Go to home and chat
            <span aria-hidden>→</span>
          </Link>
        </div>
        <p className="text-slate-500 text-sm">
          The AI uses your app’s listings and applicants (no full SSN or raw credit data is sent). Sandbox data only.
        </p>
      </div>
    </div>
  );
}
