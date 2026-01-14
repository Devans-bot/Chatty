import express from "express";
import ChatKey from "../models/chatkeymodels.js";
import User from "../models/usermodel.js";

const router = express.Router();

/**
 * 🔑 GET chat AES key
 */
router.get("/key/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;

    const existing = await ChatKey.findOne({ chatId });

    if (existing) {
      return res.json({
        exists: true,
        userA: existing.userA.toString(),
        userB: existing.userB.toString(),
        encryptedKeyForA: existing.encryptedKeyForA,
        encryptedKeyForB: existing.encryptedKeyForB,
      });
    }

    // chat key does NOT exist → frontend will generate
    const [userA, userB] = chatId.split("_");

    const userAData = await User.findById(userA).select("publicKey");
    const userBData = await User.findById(userB).select("publicKey");
     
    if (!userAData?.publicKey || !userBData?.publicKey) {
      return res.status(400).json({ message: "Public key missing" });
    }

    return res.json({
      exists: false,
      userA,
      userB,
      publicKeyA: userAData.publicKey,
      publicKeyB: userBData.publicKey,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch chat key" });
  }
});

/**
 * 🔐 SAVE new AES key
 */
router.post("/key", async (req, res) => {
  try {
    const {
      chatId,
      userA,
      userB,
      encryptedKeyForA,
      encryptedKeyForB,
    } = req.body;
      const existing = await ChatKey.findOne({ chatId });
    if (existing) {
      return res.json(existing);
    }
    const saved = await ChatKey.create({
      chatId,
      userA,
      userB,
      encryptedKeyForA,
      encryptedKeyForB,
    });

    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save chat key" });
  }
});

export default router;
