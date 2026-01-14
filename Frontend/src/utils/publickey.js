export async function importPublicKey(base64Key) {
  const binaryDer = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));

  return crypto.subtle.importKey(
    "spki",
    binaryDer.buffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );

  
}
