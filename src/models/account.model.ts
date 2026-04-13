import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  institute: { type: mongoose.Schema.Types.ObjectId, ref: "Institute", required: true },
  socialId: { type: String, required: true },
  name: { type: String, required: true },
  photo: { type: String, required: false },
  token: { type: String, required: true },
  platform: { type: String, default: "facebook", required: true, enum: ["facebook", "x", "youtube", "tiktok", "pinterest"] },
  accountType: { type: String, required: true, enum: ["page", "profile"] },
  tokenExpires: { type: Date, required: false },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }, // generated from jwt token
}, {
  timestamps: true
});

export const Account = mongoose.model("Account", accountSchema);
