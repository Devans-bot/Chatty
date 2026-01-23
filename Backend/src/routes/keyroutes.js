import express from "express";
import ChatKey from "../models/chatkeymodels.js";
import User from "../models/usermodel.js";
import crypto from "crypto";
import Device from "../models/devicemodel.js";
import { encryptWithDevicePublicKey } from "../utils/encryptedaes.js";
import { Isauth } from "../utils/isauth.js";
import { decryptForServer, encryptForServer } from "../utils/server.js";

const router = express.Router();


router.get("/key/:chatId", Isauth, async (req, res) => {
  try {
    const { chatId } = req.params;
    const deviceId = req.headers["x-device-id"];

    if (!deviceId) {
      return res.status(400).json({ message: "Missing device id" });
    }

    const chatKey = await ChatKey.findOne({ chatId });
    if (!chatKey) {
      return res.json({ exists: false });
    }

    // ✅ If key already exists for this device
    const existingEncryptedKey =
      chatKey.encryptedKeysByDevice.get(deviceId);

    if (existingEncryptedKey) {
      return res.json({
        exists: true,
        encryptedKey: existingEncryptedKey,
      });
    }

    // 🔁 Device missing → re-encrypt AES key
    const device = await Device.findOne({
      deviceId,
      revoked: false,
    });

    if (!device) {
      return res.status(403).json({ message: "Device not registered" });
    }

    // 🔓 Decrypt AES using server master key
    const aesKey = decryptForServer(chatKey.encryptedKeyForServer);

    // 🔐 Encrypt AES for this device
    const encryptedForDevice =
      encryptWithDevicePublicKey(aesKey, device.publicKey);

    // 💾 Save for future
    chatKey.encryptedKeysByDevice.set(deviceId, encryptedForDevice);
    await chatKey.save();

    // ✅ Return it
    res.json({
      exists: true,
      encryptedKey: encryptedForDevice,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch chat key" });
  }
});





router.post("/key", Isauth, async (req, res) => {

  try {
    const { chatId, userA, userB } = req.body;

    if (!chatId || !userA || !userB) {
      return res.status(400).json({ message: "Missing fields" });
    }

  
    const existing = await ChatKey.findOne({ chatId });
    if (existing) return res.json(existing);

    const aesKey = crypto.randomBytes(32);

    const encryptedKeyForServer = encryptForServer(aesKey);

    const devices = await Device.find({
      userId: { $in: [userA, userB] },
      revoked: false,
    });


    if (devices.length === 0) {
      return res.status(400).json({
        message: "No active devices found",
      });
    }

    const encryptedKeysByDevice = {};

    for (const device of devices) {
     try {
        encryptedKeysByDevice[device.deviceId] =
          encryptWithDevicePublicKey(aesKey, device.publicKey);
      } catch (e) {
        console.error("❌ Failed encrypting for device:", device.deviceId);
        console.error(e);
        throw e;
      }
    }

    
    const chatKey = await ChatKey.create({
      chatId,
      userA,
      userB,
      encryptedKeysByDevice,
      encryptedKeyForServer,
    });
   

    res.status(201).json(chatKey);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create chat key" });
  }
});

router.delete("/key/:chatId",Isauth, async (req, res) => {
  await ChatKey.deleteOne({ chatId: req.params.chatId });
  res.json({ ok: true });
});

router.post("/key/add-device", Isauth, async (req, res) => {
  const { chatId, deviceId, encryptedKey } = req.body;
 
  console.log("GET CHAT KEY");
console.log("chatId:", chatId);
console.log("deviceId:", deviceId);
console.log(
  "available devices:",
  Array.from(chatKey.encryptedKeysByDevice.keys())
);


  if (!chatId || !deviceId || !encryptedKey) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const chatKey = await ChatKey.findOne({ chatId });
  if (!chatKey) {
    return res.status(404).json({ message: "Chat key not found" });
  }

  chatKey.encryptedKeysByDevice.set(deviceId, encryptedKey);
  await chatKey.save();

  res.json({ ok: true });
});


export default router; 