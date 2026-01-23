import crypto from "crypto";

function base64ToPem(base64Key) {
  const formatted = base64Key.match(/.{1,64}/g).join("\n");
  return `-----BEGIN PUBLIC KEY-----\n${formatted}\n-----END PUBLIC KEY-----`;
}

export function encryptWithDevicePublicKey(aesKey, publicKeyBase64) {
  const pemPublicKey = base64ToPem(publicKeyBase64);

  return crypto.publicEncrypt(
    {
      key: pemPublicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    aesKey
  ).toString("base64");
}
