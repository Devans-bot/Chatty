
import express from "express";
import ChatKey from "../models/chatkeymodels.js";
import User from "../models/usermodel.js";
import Device from "../models/devicemodel.js"
import { Isauth } from "../utils/isauth.js";

const router = express.Router();

router.post("/registerdevice", Isauth, async (req, res) => {
  const { deviceId, publicKey } = req.body;

  if (!deviceId || !publicKey) {
    return res.status(400).json({
      message: "deviceId and publicKey required",
    });
  }

  // Check if device already exists
  const existingDevice = await Device.findOne({
    userId: req.user._id,
    deviceId,
  });

  if (existingDevice) {
    existingDevice.publicKey = publicKey;
    existingDevice.revoked = false;
    existingDevice.lastSeen = new Date();
    await existingDevice.save();

    return res.json({
      ok: true,
      message: "Device reconnected successfully",
    });
  }

  // New device
  await Device.create({
    userId: req.user._id,
    deviceId,
    publicKey,
    revoked: false,
    lastSeen: new Date(),
  });

  res.json({
    ok: true,
    message: "New device registered successfully",
  });
});



router.post("/revokedevice", Isauth, async (req, res) => {
  const { deviceId } = req.body;

  await Device.findOneAndUpdate(
    { userId: req.user._id, deviceId },
    { revoked: true }
  );

  await ChatKey.updateMany(
    {},
    { $unset: { [`encryptedKeysByDevice.${deviceId}`]: "" } }
  );

  res.json({ ok: true });
});


export default router