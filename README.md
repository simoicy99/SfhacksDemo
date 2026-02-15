# Forward Adjustable Rent Offers

Demo: credit-informed rent offer bundles for landlords and tenants. Landlords set base rent and constraints; tenants get 3–5 personalized options (rent, deposit, term, autopay) based on a soft credit prequal. Uses CRS Credit API sandbox; no full SSN stored; consent and audit built in.

## Setup (under 5 minutes)

1. **Clone and install**
   ```bash
   cd adjustableRent
   pnpm install
   ```

2. **Environment variables**
   - Copy `.env.example` to `.env`
   - Set:
     - `MONGODB_URI` – e.g. `mongodb://localhost:27017/forward-demo`
     - `CRS_USERNAME` / `CRS_PASSWORD` – from SF Hacks CRS track / Stitch Credit sandbox
     - `ENCRYPTION_SECRET` – optional; 32+ character secret to encrypt CRS raw response at rest (if unset, only a summary is stored)
     - `APP_BASE_URL` – optional; default `http://localhost:3000`
     - `ANTHROPIC_API_KEY` – optional; for **Find matches** (Claude) to search sandbox for compatible roommates, tenants, or listings

3. **Run**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3001](http://localhost:3001).

## Env var template

See `.env.example` for all variables.

## Seed data

Create one listing and one applicant (no full SSN):

```bash
pnpm seed
```

This creates a listing and an applicant (Kylia Paolimelli–style) so you can test the flow. To run the full demo, use the in-app **“Use sandbox sample data”** on the applicant page to pre-fill the form, then **“Pull prequal and generate offers”**.

## Troubleshooting

- **401 / token errors**  
  The app caches the CRS token in memory with a 20-minute TTL and refreshes on 401. If you still see 401, check `CRS_USERNAME` and `CRS_PASSWORD` and that the CRS sandbox login endpoint is `POST https://api-sandbox.stitchcredit.com:443/api/users/login`.

- **Mongo connection**  
  Ensure MongoDB is running and `MONGODB_URI` is correct. Use **GET /api/health** to verify: `curl http://localhost:3001/api/health`.

- **Prequal fails**  
  Use sandbox test data only (e.g. the sample data from the SF Hacks CRS page). Do not use real PII. If the API returns an error, check the response body and the CRS MCP/docs for payload and field requirements.

## AI match search (Claude)

With `ANTHROPIC_API_KEY` set, use **Find matches** in the nav or go to **/demo/match**. Choose “Landlord” or “Tenant,” add optional criteria, and run a search. Claude uses your DB listings and applicants (no full SSN) plus CRS sandbox context to suggest compatible matches. The CRS MCP server is for use inside Claude Desktop/Code; this app calls the Anthropic API directly from the server.

## Routes

- **GET /api/health** – Checks MongoDB connection.
- **POST /api/ai/match** – AI match search (role, criteria) → Claude suggestions.
- **POST /api/listings** – Create listing.
- **POST /api/applicants** – Create applicant (SSN stored as last4 + hash only).
- **POST /api/consent** – Record consent (applicantId, listingId, signedName).
- **POST /api/crs/prequal** – Consent-validated prequal; generates and persists offers.
- **GET /api/offers/:offerId** – Fetch offer menu and metadata.
- **GET /api/audit?offerId=** – Fetch audit events for an offer.

## CRS integration

- **lib/crsClient.ts** – `login()` (Bearer token, 20-min TTL, refresh on 401), `requestPrequal(payload)`.
- Prequal endpoint: `POST .../api/experian/credit-profile/credit-report/standard/exp-prequal-vantage4` with `Authorization: Bearer <token>`.

## MCP and debugging

See **docs/mcp-setup.md** for enabling the CRS MCP in Cursor and what to ask (token errors, payload format, response fields, rate limits).

## Disclaimer

Demo only. Not financial or legal advice. Use of credit data requires applicant consent and a permissible purpose (e.g. tenant screening). Do not use real PII in the sandbox.
