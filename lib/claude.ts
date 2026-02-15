import Anthropic from "@anthropic-ai/sdk";

const DEFAULT_MODEL = "claude-sonnet-4-5-20250929";

function getModel(): string {
  return process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;
}

const CRS_SANDBOX_CONTEXT = `
You are helping match listings with tenants (or roommates) in a rental app that uses the CRS Credit API sandbox.

CRS Sandbox context:
- Sandbox base URL: https://api-sandbox.stitchcredit.com/api
- Test SSNs in sandbox often start with 666 (e.g. 666001001). We never store full SSN; only last 4 + hash.
- Prequal endpoint: POST /experian/credit-profile/credit-report/standard/exp-prequal-vantage4
- Common request fields: firstName, lastName, birthDate, ssn, address (line1, city, state, postalCode).
- You can suggest "sandbox-compatible" matches based on listing constraints (base rent, deposit range, term range, autopay discount) and applicant/tenant profiles.
- Compatible means: tenant's implied budget fits the listing's rent/deposit range; lease term preferences align; risk band from credit prequal fits the landlord's policy (e.g. higher risk may require higher deposit).
`;

export type MatchSearchRole = "landlord" | "tenant";

export interface MatchSearchInput {
  role: MatchSearchRole;
  listingId?: string;
  applicantId?: string;
  criteria?: string;
}

export async function searchMatchesWithClaude(
  input: MatchSearchInput,
  context: { listings: unknown[]; applicants: unknown[]; offers?: unknown[] }
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

  const anthropic = new Anthropic({ apiKey });

  const listingsJson = JSON.stringify(context.listings, null, 2);
  const applicantsJson = JSON.stringify(context.applicants, null, 2);
  const offersJson = context.offers ? JSON.stringify(context.offers, null, 2) : "[]";

  const userPrompt =
    input.role === "landlord"
      ? `You are searching for compatible tenants or roommates for a listing.

**Listing(s) in our database (relevant fields):**
${listingsJson}

**Applicants in our database (we only store last4 SSN, no full SSN):**
${applicantsJson}

**Existing offers (risk band, recommended terms):**
${offersJson}

${input.listingId ? `Focus on listing ID: ${input.listingId}.` : ""}
${input.criteria ? `Additional criteria from the user: ${input.criteria}` : ""}

Using the sandbox context: suggest which applicants are compatible with the listing(s) and why (e.g. rent range, term, risk band). Keep responses concise and actionable. Mention that this is sandbox/demo data.`
      : `You are searching for compatible listings or roommates for a tenant.

**Listings in our database:**
${listingsJson}

**Applicants in our database (we only store last4 SSN):**
${applicantsJson}

**Existing offers (risk band, recommended terms):**
${offersJson}

${input.applicantId ? `Focus on applicant ID: ${input.applicantId}.` : ""}
${input.criteria ? `Additional criteria from the user: ${input.criteria}` : ""}

Using the sandbox context: suggest which listings are compatible with the tenant and why. Keep responses concise and actionable. Mention that this is sandbox/demo data.`;

  const message = await anthropic.messages.create({
    model: getModel(),
    max_tokens: 1024,
    system: CRS_SANDBOX_CONTEXT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") return "No response generated.";
  return textBlock.text;
}

const CHAT_SYSTEM_PROMPT = `You are a helpful assistant for Forward, a rental app that offers adjustable rent bundles based on soft credit prequal (CRS Credit API sandbox). You can answer questions about:
- How the app works (listings, applicant consent, prequal, offer menu, audit).
- CRS sandbox (test SSNs, endpoints, tenant screening).
- Finding compatible roommates, tenants, or listings.
Keep answers concise and friendly. If asked about the demo, mention sandbox data and that users can try "Find matches" or the landlord/tenant flows.`;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function chatWithClaude(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

  const anthropic = new Anthropic({ apiKey });

  const apiMessages = messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  const message = await anthropic.messages.create({
    model: getModel(),
    max_tokens: 1024,
    system: CHAT_SYSTEM_PROMPT,
    messages: apiMessages,
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") return "No response generated.";
  return textBlock.text;
}
