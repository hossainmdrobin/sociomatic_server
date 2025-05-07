import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  socialId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photo: { type: String, required: false },
  token: { type: String, required: false },
  accountType: { type: String, required: true },
  tokenExpires: { type: Date, required: false },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, {
  timestamps: true
});

export const Account = mongoose.model("Account", accountSchema);
