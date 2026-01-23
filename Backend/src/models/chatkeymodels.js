import mongoose from "mongoose";

const chatKeySchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
      unique: true,
    },
    userA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
   encryptedKeysByDevice: {
  type: Map,
  of: String, // base64 encrypted AES key
},
encryptedKeyForServer: {
    type: String,
    required: true,
  },

  },
  { timestamps: true }
);

export default mongoose.model("ChatKey", chatKeySchema);
