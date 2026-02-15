const ALGO = "aes-256-gcm";
const IV_LEN = 16;
const AUTH_TAG_LEN = 16;

function getKey(secret: string): Buffer {
  const { createHash } = require("crypto");
  return createHash("sha256").update(secret).digest();
}

export function encrypt(plaintext: string, secret: string): string {
  const crypto = require("crypto");
  const key = getKey(secret);
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, enc]).toString("base64");
}

export function decrypt(ciphertext: string, secret: string): string {
  const crypto = require("crypto");
  const key = getKey(secret);
  const buf = Buffer.from(ciphertext, "base64");
  const iv = buf.subarray(0, IV_LEN);
  const authTag = buf.subarray(IV_LEN, IV_LEN + AUTH_TAG_LEN);
  const enc = buf.subarray(IV_LEN + AUTH_TAG_LEN);
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(authTag);
  return decipher.update(enc) + decipher.final("utf8");
}
