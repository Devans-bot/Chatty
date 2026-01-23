import crypto from "crypto";

const ALGO = "aes-256-gcm";
const SERVER_KEY = crypto
  .createHash("sha256")
  .update(process.env.SERVER_KEY_SECRET)
  .digest();

export function encryptForServer(aesKey) {
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(ALGO, SERVER_KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(aesKey),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decryptForServer(payload) {
  const data = Buffer.from(payload, "base64");

  const iv = data.slice(0, 12);
  const tag = data.slice(12, 28);
  const encrypted = data.slice(28);

  const decipher = crypto.createDecipheriv(ALGO, SERVER_KEY, iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
}
