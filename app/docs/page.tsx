import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="page-container max-w-3xl">
      <Link href="/" className="back-link">
        <span aria-hidden>←</span> Home
      </Link>

      <h1 className="font-heading text-3xl font-bold text-slate-800 mb-2">Documentation</h1>
      <p className="text-slate-600 mb-10">
        Setup, environment, API routes, and troubleshooting for Forward.
      </p>

      <div className="space-y-10">
        <section className="card p-6">
          <h2 className="font-heading text-xl font-bold text-slate-800 mb-3">Setup</h2>
          <ol className="list-decimal list-inside text-slate-600 text-sm space-y-2 mb-4">
            <li>Clone and run <code className="bg-slate-100 px-1.5 py-0.5 rounded">pnpm install</code></li>
            <li>Copy <code className="bg-slate-100 px-1.5 py-0.5 rounded">.env.example</code> to <code className="bg-slate-100 px-1.5 py-0.5 rounded">.env</code> and set variables (see below)</li>
            <li>Run <code className="bg-slate-100 px-1.5 py-0.5 rounded">pnpm dev</code> and open the app URL (e.g. http://localhost:3000)</li>
          </ol>
        </section>

        <section className="card p-6">
          <h2 className="font-heading text-xl font-bold text-slate-800 mb-3">Environment variables</h2>
          <ul className="text-slate-600 text-sm space-y-2">
            <li><strong className="text-slate-700">MONGODB_URI</strong> – MongoDB connection string (e.g. <code className="bg-slate-100 px-1 rounded">mongodb://localhost:27017/forward-demo</code>)</li>
            <li><strong className="text-slate-700">CRS_USERNAME</strong> / <strong className="text-slate-700">CRS_PASSWORD</strong> – CRS Credit API sandbox credentials</li>
            <li><strong className="text-slate-700">ENCRYPTION_SECRET</strong> – Optional; 32+ chars to encrypt CRS response at rest</li>
            <li><strong className="text-slate-700">APP_BASE_URL</strong> – Optional; base URL for links</li>
            <li><strong className="text-slate-700">ANTHROPIC_API_KEY</strong> – Optional; for AI chat and match suggestions on the home page</li>
          </ul>
        </section>

        <section className="card p-6">
          <h2 className="font-heading text-xl font-bold text-slate-800 mb-3">Seed data</h2>
          <p className="text-slate-600 text-sm mb-2">
            Create one listing and one applicant (no full SSN):
          </p>
          <pre className="bg-slate-100 rounded-xl p-4 text-sm text-slate-700 overflow-x-auto">pnpm seed</pre>
          <p className="text-slate-600 text-sm mt-2">
            Then use the applicant page with sandbox sample data and “Get my offers” to run the full flow.
          </p>
        </section>

        <section className="card p-6">
          <h2 className="font-heading text-xl font-bold text-slate-800 mb-3">API routes</h2>
          <ul className="text-slate-600 text-sm space-y-2 font-mono">
            <li><strong className="text-slate-700">GET</strong> /api/health – MongoDB health check</li>
            <li><strong className="text-slate-700">POST</strong> /api/ai/chat – Chat with AI (messages)</li>
            <li><strong className="text-slate-700">POST</strong> /api/ai/match – AI match search (role, criteria)</li>
            <li><strong className="text-slate-700">POST</strong> /api/listings – Create listing</li>
            <li><strong className="text-slate-700">POST</strong> /api/applicants – Create applicant (last4 + hash only)</li>
            <li><strong className="text-slate-700">POST</strong> /api/consent – Record consent</li>
            <li><strong className="text-slate-700">POST</strong> /api/crs/prequal – Prequal and generate offers</li>
            <li><strong className="text-slate-700">GET</strong> /api/offers/:offerId – Fetch offer menu</li>
            <li><strong className="text-slate-700">GET</strong> /api/audit?offerId= – Audit events</li>
          </ul>
        </section>

        <section className="card p-6">
          <h2 className="font-heading text-xl font-bold text-slate-800 mb-3">CRS integration</h2>
          <p className="text-slate-600 text-sm mb-2">
            <code className="bg-slate-100 px-1.5 py-0.5 rounded">lib/crsClient.ts</code> – login (Bearer, 20‑min TTL, refresh on 401), requestPrequal(payload).
          </p>
          <p className="text-slate-600 text-sm">
            Prequal: <code className="bg-slate-100 px-1.5 py-0.5 rounded">POST .../api/experian/credit-profile/credit-report/standard/exp-prequal-vantage4</code> with <code className="bg-slate-100 px-1 rounded">Authorization: Bearer &lt;token&gt;</code>.
          </p>
        </section>

        <section className="card p-6">
          <h2 className="font-heading text-xl font-bold text-slate-800 mb-3">Troubleshooting</h2>
          <ul className="text-slate-600 text-sm space-y-2">
            <li><strong className="text-slate-700">401 / token errors</strong> – Check CRS_USERNAME and CRS_PASSWORD; sandbox login is POST to api-sandbox.stitchcredit.com.</li>
            <li><strong className="text-slate-700">Mongo connection</strong> – Ensure MongoDB is running and MONGODB_URI is correct. Use GET /api/health to verify.</li>
            <li><strong className="text-slate-700">Prequal fails</strong> – Use sandbox test data only; no real PII. Check CRS docs for payload and field requirements.</li>
          </ul>
        </section>

        <section className="rounded-xl bg-amber-50 border border-amber-200/80 p-5 text-sm text-amber-900">
          <strong>Disclaimer.</strong> Demo only. Not financial or legal advice. Credit data use requires consent and permissible purpose (e.g. tenant screening). Do not use real PII in the sandbox.
        </section>
      </div>

      <div className="mt-10">
        <Link href="/" className="btn-secondary">
          Back to home
        </Link>
      </div>
    </div>
  );
}
