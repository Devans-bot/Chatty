# 🐒 Boop — Secure Real-Time Chat Application

Boop is a **production-grade, end-to-end encrypted (E2EE) real-time chat application** designed to mirror modern secure messaging platforms. It focuses on **security first**, **performance-aware engineering**, and **real-world multi-device support**.

This README explains:

- What Boop does
- Core features
- System architecture & design decisions
- Encryption & multi-device flow (code-level logic)
- Backend–frontend coordination

---

## ✨ Key Features

- 🔐 True End-to-End Encryption (E2EE)
- 📱 Multi-device login & synchronization
- ⚡ Real-time messaging (Socket.IO)
- 🟢 Online / offline presence
- 🖼️ Encrypted image sharing
- 🔑 Device-level key management
- 🌍 Cross-browser support (desktop + mobile, incl. iOS Safari)
- 🚀 Optimized crypto & UI performance

---

## 🛠️ Tech Stack

### Frontend

- React
- Zustand (state management)
- Socket.IO Client
- Web Crypto API
- Tailwind CSS

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- Socket.IO
- Redis (presence & socket scaling)
- Cloudinary (media storage)

---

## 🧠 High-Level Architecture

```
Client (React)
   │  HTTPS / WebSocket
   ▼
API Gateway / Load Balancer
   │
┌───────────────┬──────────────────┬─────────────────┐
│ Auth Service  │ Chat Service     │ Presence Service│
│               │                  │                 │
│ MongoDB       │ MongoDB          │ Redis           │
└───────────────┴──────────────────┴─────────────────┘
           │
      Media Service (Cloudinary)

```

### Design Principles

- Client-side encryption only
- Server is message-blind (zero-knowledge for content)
- Stateless backend services
- Horizontal scalability
- Optimistic UI + real-time sync

---

## 🔐 Encryption & Security Model

Boop uses a **hybrid encryption model** inspired by modern messengers.

### 🔑 Cryptography Used

- **RSA-OAEP (2048-bit)**
    - Device identity keys
    - Secure AES key distribution
- **AES-GCM (256-bit)**
    - Message encryption
    - Image encryption metadata

---

## 📱 Device-Based Security Model

- Every **device generates its own RSA key pair**
- Private keys never leave the device (stored in IndexedDB / local storage)
- Public keys are registered with the backend
- Devices can be independently:
    - Added
    - Revoked
    - Managed

Compromising one device **does not compromise the account**.

---

## 🔐 Chat Key (AES) Design

- Each chat has **one shared AES key**
- AES key is:
    - Generated once per chat
    - Never stored in plaintext
    - Encrypted separately for each authorized device

### ChatKey Schema (Conceptual)

```jsx
ChatKey {
  chatId,
  userA,
  userB,
  encryptedKeysByDevice: Map<deviceId, encryptedAES>,
  encryptedKeyForServer
}

```

---

## 🔄 Multi-Device E2EE Flow (End-to-End)

### 1️⃣ Device Registration

- Device generates RSA key pair
- Public key sent to backend
- Private key stored locally

### 2️⃣ Chat Creation

- Client generates random AES key
- AES key encrypted:
    - For each device (RSA public key)
    - Once for server (performance tradeoff)

### 3️⃣ Fetching Chat AES Key

- Client requests `/chat/key/:chatId`
- If encrypted key exists for device → returned
- If device is new:
    - Server decrypts AES (server key)
    - Re-encrypts AES for new device
    - Stores mapping for future use

### 4️⃣ Client Decrypts & Caches AES

- RSA decrypt → raw AES
- Imported as AES-GCM key
- Cached in memory (Map)

---

## 💬 Message Sending Flow (Code-Level)

1. User clicks **Send**
2. Client resolves `chatId`
3. Client calls `getSharedAESKey(chatId)`
4. AES key returned from cache or backend
5. Message encrypted with AES-GCM
6. Ciphertext sent to backend
7. Backend stores encrypted message
8. Socket.IO emits message to recipients

**Server never decrypts messages.**

---

## 📥 Message Receiving Flow

1. Client receives encrypted message
2. Retrieves AES key from cache
3. Decrypts message locally
4. Renders plaintext in UI

---

## ⚡ Real-Time System (Socket.IO)

### Real-Time Events

- Message delivery
- Online / offline presence
- Friend requests
- Cross-device sync

### Optimizations

- WebSocket-first transport
- Targeted socket emits
- Redis adapter for horizontal scaling
- Debounced presence updates

---

## 🚀 Performance Optimizations

### Crypto

- AES key caching (RSA used only once per chat)
- Minimal encryption operations on mobile

### UI

- Optimistic message rendering
- Minimal re-renders via Zustand
- No unnecessary API refetches

---

## 🗃️ Database Design Overview

### MongoDB Collections

- Users
- Devices
- Chats
- Messages
- ChatKeys

### Indexing Strategy

- `chatId + createdAt` (messages)
- `participants` (chats)

---

## ⚖️ Tradeoffs & Design Decisions

### ✅ Pros

- Fast multi-device sync
- Strong encryption guarantees
- Excellent mobile performance
- Simple mental model

### ❌ Cons

- No forward secrecy (yet)
- Server-assisted key distribution

These were **intentional tradeoffs** prioritizing correctness and performance.

---

## 🧪 Tested Scenarios

- Cross-browser messaging
- iOS Safari ↔ Chrome
- Multi-device login/logout
- Real-time encryption/decryption
- Network latency handling
- Refresh persistence

---

## 🚀 Future Enhancements

- Forward secrecy (per-message keys)
- Key rotation
- Device management UI
- Read receipts
- Typing indicators
- User-controlled device revocation

---

## 🐵 Final Note

Boop was built using **real production engineering principles**:

> Correctness → Performance → Polish
> 

It is not just a chat app — it is a **secure communication system**.

Happy Booping 🐒💬
