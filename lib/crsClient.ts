const BASE_URL = "https://api-sandbox.stitchcredit.com:443/api";
const TOKEN_TTL_MS = 20 * 60 * 1000; // 20 minutes

let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

export async function login(): Promise<string> {
  const username = process.env.CRS_USERNAME;
  const password = process.env.CRS_PASSWORD;
  if (!username || !password) {
    throw new Error("CRS_USERNAME and CRS_PASSWORD must be set");
  }
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`CRS login failed: ${res.status} ${text}`);
  }
  const data = (await res.json()) as { accessToken?: string; token?: string; expiresAt?: number };
  const token = data.accessToken ?? data.token;
  if (!token) throw new Error("CRS login response missing token");
  cachedToken = token;
  tokenExpiresAt = data.expiresAt
    ? data.expiresAt * 1000
    : Date.now() + TOKEN_TTL_MS;
  return token;
}

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt - 60000) {
    return cachedToken;
  }
  return login();
}

export interface PrequalPayload {
  firstName: string;
  middleName?: string;
  lastName: string;
  birthDate: string;
  ssn: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

export async function requestPrequal(payload: PrequalPayload): Promise<unknown> {
  const token = await getToken();
  const body = {
    firstName: payload.firstName,
    ...(payload.middleName && { middleName: payload.middleName }),
    lastName: payload.lastName,
    birthDate: payload.birthDate,
    ssn: payload.ssn.replace(/\D/g, ""),
    address: {
      line1: payload.address.line1,
      ...(payload.address.line2 && { line2: payload.address.line2 }),
      city: payload.address.city,
      state: payload.address.state,
      postalCode: payload.address.postalCode,
    },
  };
  const res = await fetch(
    `${BASE_URL}/experian/credit-profile/credit-report/standard/exp-prequal-vantage4`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  );
  if (res.status === 401) {
    cachedToken = null;
    tokenExpiresAt = 0;
    return requestPrequal(payload);
  }
  const text = await res.text();
  if (!res.ok) throw new Error(`CRS prequal failed: ${res.status} ${text}`);
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { raw: text };
  }
}
