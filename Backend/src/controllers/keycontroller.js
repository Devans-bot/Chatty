import User from "../models/usermodel.js";

export const uploadPublicKey = async (req, res) => {
  try {
    const { publicKey } = req.body;

    if (!publicKey) {
      return res.status(400).json({ message: "Public key required" });

    }

    console.log("📥 Upload public key for user:", req.user._id);
  console.log("🔑 Public key length:", req.body.publicKey?.length);


    await User.findByIdAndUpdate(req.user._id, {
      publicKey,
    });

    res.status(200).json({ message: "Public key saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save public key" });
  }

  console.log("📥 Upload public key for user:", req.user._id);
console.log("🔑 Public key length:", publicKey.length);

};
