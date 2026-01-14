export async function getPrivateKey(userId) {
  const base64 = localStorage.getItem(`privateKey-${userId}`);
  if (!base64) throw new Error("Private key missing");

  const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

  return crypto.subtle.importKey(
    "pkcs8",
    binary,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["decrypt"]
  );
}
