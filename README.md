# Forward — Adjustable Rent Offers

**Personalized rent options for tenants and credit-informed, reliable screening for landlords.**

Built for **SF Hacks 2026** · [CRS FinTech Powered by CRS](https://sf-hacks.crscreditapi.com/) track.  
**Powered by CRS Credit API** (sandbox: `https://api-sandbox.stitchcredit.com/api`).

---

## For judges: try the demo in under 2 minutes

1. **Start demo** (nav) → **Create listing** (defaults are pre-filled; click “Save & continue to applicant”).
2. **Get my offers** (applicant page: enter your name, check consent, submit).
3. See your **offer menu** (3–5 bundles, one recommended), **“Why this menu?”** (risk band + factors from CRS), and **Audit log**.

**Path:** Start demo → Create listing → Get my offers

---

## What we built

- **Landlords** set base rent and rules (deposit range, term, autopay discount). Applicants are soft-prequalified via the **CRS Credit API** (Experian prequal, `exp-prequal-vantage4`). We compute a risk band (A/B/C/D) and generate 3–5 offer bundles; one is recommended. Consent and audit are recorded; no full SSN is stored (last4 + hash only).
- **Tenants** get personalized rent options that fit their profile instead of a single take-it-or-leave-it offer (e.g. lower move-in cost, different term, autopay discount).
- **AI chat** on the home page: ask “How does the demo work?” or “Find me compatible tenants.” **Find matches** directs users to chat in plain language.

---

## Tech stack

- **Next.js 14** (App Router), TypeScript, Tailwind
- **MongoDB** (Mongoose) for listings, applicants, consent, offers, audit
- **CRS Credit API** sandbox for login + Experian prequal
- **Anthropic Claude** for chat and match suggestions (optional; set `ANTHROPIC_API_KEY`)

---

## Setup (under 5 minutes)

1. **Clone and install**
   ```bash
   git clone <your-repo-url>
   cd adjustableRent
   pnpm install
   ```

2. **Environment variables**  
   Copy `.env.example` to `.env` and set:
   - `MONGODB_URI` – e.g. `mongodb://localhost:27017/forward-demo`
   - `CRS_USERNAME` / `CRS_PASSWORD` – from [CRS SF Hacks](https://sf-hacks.crscreditapi.com/) (email signup for sandbox credentials)
   - `ENCRYPTION_SECRET` – optional; 32+ chars to encrypt CRS response at rest
   - `APP_BASE_URL` – optional
   - `ANTHROPIC_API_KEY` – optional; for AI chat and match suggestions

3. **Run**
   ```bash
   pnpm dev
   ```
   Open the URL shown (e.g. http://localhost:3000).

4. **Seed** (optional)
   ```bash
   pnpm seed
   ```
   Creates one listing and one applicant for testing.

---

## CRS Credit API usage

- **Auth:** `POST .../api/users/login` → Bearer token (cached in memory, 20-min TTL, refresh on 401).
- **Prequal:** `POST .../api/experian/credit-profile/credit-report/standard/exp-prequal-vantage4` with `Authorization: Bearer <token>`.
- Implemented in `lib/crsClient.ts`; prequal is triggered from `POST /api/crs/prequal` after consent is recorded.

---

## Main routes

| Route | Description |
|-------|-------------|
| `GET /api/health` | MongoDB health check |
| `POST /api/listings` | Create listing |
| `POST /api/applicants` | Create applicant (last4 + hash only) |
| `POST /api/consent` | Record consent |
| `POST /api/crs/prequal` | Run prequal, create offers |
| `GET /api/offers/:offerId` | Get offer menu |
| `GET /api/audit?offerId=` | Audit events |
| `POST /api/ai/chat` | Chat with Claude |
| `POST /api/ai/match` | AI match search |

---

## Troubleshooting

- **401 / token errors** — Check `CRS_USERNAME` and `CRS_PASSWORD`; sandbox login is `POST https://api-sandbox.stitchcredit.com:443/api/users/login`.
- **Mongo connection** — Ensure MongoDB is running and `MONGODB_URI` is correct. Use `GET /api/health` to verify.
- **Prequal fails** — Use sandbox test data only (no real PII). See CRS/Postman docs for payload and field requirements.

---

## Disclaimer

Demo only. Not financial or legal advice. Use of credit data requires applicant consent and a permissible purpose (e.g. tenant screening). Do not use real PII in the sandbox.
