import { createHash, randomBytes } from "crypto";

const SSN_SALT = process.env.SSN_SALT || "forward-demo-ssn-salt-change-in-prod";

export function ssnLast4(ssn: string): string {
  const digits = ssn.replace(/\D/g, "");
  return digits.slice(-4);
}

export function ssnHash(ssn: string): string {
  const digits = ssn.replace(/\D/g, "");
  return createHash("sha256").update(SSN_SALT + digits).digest("hex");
}

export function normalizeSsn(ssn: string): string {
  return ssn.replace(/\D/g, "");
}
