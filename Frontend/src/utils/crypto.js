
export async function encryptWithAES(text, aesKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const cipherText = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    new TextEncoder().encode(text)
  );

  return {
    cipherText: btoa(String.fromCharCode(...new Uint8Array(cipherText))),
    iv: btoa(String.fromCharCode(...iv)),
  };
}


export async function decryptWithAES(msg, aesKey) {
  const iv = Uint8Array.from(atob(msg.iv), c => c.charCodeAt(0));
  const cipher = Uint8Array.from(atob(msg.cipherText), c => c.charCodeAt(0));

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    aesKey,
    cipher
  );

  return new TextDecoder().decode(decrypted);
}
