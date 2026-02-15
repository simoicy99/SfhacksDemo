import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="page-container max-w-2xl">
      <Link href="/" className="back-link">
        <span aria-hidden>←</span> Home
      </Link>
      <h1 className="font-heading text-3xl font-bold text-slate-800 mb-2">How it works</h1>
      <p className="text-slate-600 mb-10">
        Forward shows tenants personalized rent offer bundles based on a soft credit check—so landlords can offer flexible terms and tenants see options that fit their profile.
      </p>

      <section className="space-y-6">
        <div className="card p-6">
          <span className="inline-flex w-9 h-9 rounded-full bg-green-100 text-green-700 font-heading font-bold items-center justify-center text-sm mb-3">1</span>
          <h2 className="font-heading text-lg font-semibold text-slate-800 mb-2">Landlord creates a listing</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Set the property address, base rent, deposit range (min–max), lease term range (e.g. 3–12 months), and the maximum autopay discount you’re willing to offer. This defines the “menu” of possible terms.
          </p>
        </div>

        <div className="card p-6">
          <span className="inline-flex w-9 h-9 rounded-full bg-green-100 text-green-700 font-heading font-bold items-center justify-center text-sm mb-3">2</span>
          <h2 className="font-heading text-lg font-semibold text-slate-800 mb-2">Applicant consents and gets prequalified</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-3">
            The tenant (or landlord on their behalf) enters minimal info. In this demo we use <strong>sandbox data</strong>—you only type your name (or a reference number) so judges can click through quickly. The app records explicit consent, then calls the CRS Credit API sandbox for a soft prequal. No full SSN is stored—only last 4 digits and a hash for deduplication.
          </p>
          <p className="text-slate-500 text-xs">
            Permissible purpose: tenant screening. Consent and request ID are stored for compliance.
          </p>
        </div>

        <div className="card p-6">
          <span className="inline-flex w-9 h-9 rounded-full bg-green-100 text-green-700 font-heading font-bold items-center justify-center text-sm mb-3">3</span>
          <h2 className="font-heading text-lg font-semibold text-slate-800 mb-2">Personalized offer menu</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            From the prequal result we compute a risk band (A/B/C/D) and generate 3–5 offer bundles that trade off monthly rent, deposit, lease term, and autopay discount. One option is highlighted as recommended. The landlord sees a clean menu, a short “Why this menu?” explainer (risk band + factors), and an audit log of consent and credit pull.
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 text-sm text-slate-700">
          <h3 className="font-heading font-semibold text-slate-800 mb-2">What you’ll see in the demo</h3>
          <ul className="list-disc list-inside space-y-1.5 text-slate-600">
            <li>Create a listing (or use defaults) and continue to the applicant step.</li>
            <li>Applicant form is pre-filled with sandbox data; you only enter your name (or number).</li>
            <li>Check consent, sign with your name, and click “Get my offers”.</li>
            <li>View the offer cards, recommended option, explainability, and audit log.</li>
          </ul>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/demo/listing" className="btn-primary">
          Start demo
        </Link>
        <Link href="/" className="btn-secondary">
          Back to home
        </Link>
      </div>
    </div>
  );
}
