import { axiosinstance } from "../store/axiosinstance";

let creatingChatKey = false;

export async function getSharedAESKey(chatId) {
  const deviceId = localStorage.getItem("deviceId");
  if (!deviceId) throw new Error("Device not registered");

  // 1️⃣ Try fetching key
  let res;
  try {
    res = await axiosinstance.get(`/chat/key/${chatId}`, {
      headers: { "x-device-id": deviceId },
    });
  } catch (err) {
    throw new Error("Failed to fetch chat key");
  }

  // 2️⃣ If key does NOT exist → create ONCE
  if (!res.data.exists) {
    if (creatingChatKey) {
      // wait until another call finishes creating
      await new Promise(resolve => setTimeout(resolve, 200));
      return getSharedAESKey(chatId);
    }

    creatingChatKey = true;
    try {
      await axiosinstance.post("/chat/key", {
        chatId,
        userA: chatId.split("_")[0],
        userB: chatId.split("_")[1],
      });
    } finally {
      creatingChatKey = false;
    }

    // fetch again AFTER creation
    return getSharedAESKey(chatId);
  }

  // 3️⃣ Decrypt AES key
  const encryptedKey = res.data.encryptedKey;

  const privateKeyBase64 = localStorage.getItem(
    `devicePrivateKey-${deviceId}`
  );
  if (!privateKeyBase64) throw new Error("Device private key missing");

  const privateKeyBytes = Uint8Array.from(
    atob(privateKeyBase64),
    c => c.charCodeAt(0)
  );

  const devicePrivateKey = await crypto.subtle.importKey(
    "pkcs8",
    privateKeyBytes,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["decrypt"]
  );

  const rawKey = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    devicePrivateKey,
    Uint8Array.from(atob(encryptedKey), c => c.charCodeAt(0))
  );

  return crypto.subtle.importKey(
    "raw",
    rawKey,
    "AES-GCM",
    false,
    ["encrypt", "decrypt"]
  );
}
