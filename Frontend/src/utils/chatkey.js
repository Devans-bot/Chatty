import { axiosinstance } from "../store/axiosinstance";
import { importPublicKey } from "./publickey";
import { getPrivateKey } from "./privatekey";

const getChatId = (a, b) => [a, b].sort().join("_");

export async function getSharedAESKey(myId, otherUserId) {
  const chatId = getChatId(myId, otherUserId);
  
  // 1️⃣ Ask backend if AES key already exists
  const res = await  axiosinstance.get(`/chat/key/${chatId}`);


  let encryptedKeyBase64;

  if (res.data.exists) {
    encryptedKeyBase64 =
      myId === res.data.userA
        ? res.data.encryptedKeyForA
        : res.data.encryptedKeyForB;
  } else {
    // 2️⃣ Generate AES key
    const aesKey = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    const rawKey = await crypto.subtle.exportKey("raw", aesKey);

    // 3️⃣ Import both public keys (from backend response)
    const pubA = await importPublicKey(res.data.publicKeyA);
    const pubB = await importPublicKey(res.data.publicKeyB);

    // 4️⃣ Encrypt AES key for both users
    const encryptedForA = await crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      pubA,
      rawKey
    );

    const encryptedForB = await crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      pubB,
      rawKey
    );

    // 5️⃣ Store encrypted AES key in backend
    await axiosinstance.post(`/chat/key`, {
      chatId,
      userA: myId,
      userB: otherUserId,
      encryptedKeyForA: btoa(String.fromCharCode(...new Uint8Array(encryptedForA))),
      encryptedKeyForB: btoa(String.fromCharCode(...new Uint8Array(encryptedForB))),
    });

    encryptedKeyBase64 =
      myId === res.data.userA
        ? btoa(String.fromCharCode(...new Uint8Array(encryptedForA)))
        : btoa(String.fromCharCode(...new Uint8Array(encryptedForB)));
  }

  // 6️⃣ Decrypt AES key locally
  const privateKey = await getPrivateKey(myId);

  const rawKey = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    Uint8Array.from(atob(encryptedKeyBase64), c => c.charCodeAt(0))
  );

  return crypto.subtle.importKey(
    "raw",
    rawKey,
    "AES-GCM",
    false,
    ["encrypt", "decrypt"]
  );
}
