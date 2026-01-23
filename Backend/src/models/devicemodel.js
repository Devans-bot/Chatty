import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  deviceId: {
    type: String,
    required: true,
  },
  publicKey: {
    type: String,
    required: true,
  },
  revoked: {
    type: Boolean,
    default: false,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Device", deviceSchema);
