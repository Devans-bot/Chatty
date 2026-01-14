import ChatKey from "../models/chatkeymodels.js";
import User from "../models/usermodel.js";

// GET /chat/key/:chatId
export const getChatKey = async (req, res) => {
  const { chatId } = req.params;

  const chatKey = await ChatKey.findOne({ chatId });

  if (chatKey) {
    return res.json({
      exists: true,
      ...chatKey.toObject(),
    });
  }

  // If not exists → send public keys so frontend can create AES
  const [userA, userB] = chatId.split("_");

  const user1 = await User.findById(userA).select("publicKey");
  const user2 = await User.findById(userB).select("publicKey");

  res.json({
    exists: false,
    userA,
    userB,
    publicKeyA: user1.publicKey,
    publicKeyB: user2.publicKey,
  });
};

// POST /chat/key
export const createChatKey = async (req, res) => {
  const {
    chatId,
    userA,
    userB,
    encryptedKeyForA,
    encryptedKeyForB,
  } = req.body;

  const existing = await ChatKey.findOne({ chatId });
  if (existing) return res.status(200).json(existing);

  const chatKey = await ChatKey.create({
    chatId,
    userA,
    userB,
    encryptedKeyForA,
    encryptedKeyForB,
  });

  res.status(201).json(chatKey);
};
