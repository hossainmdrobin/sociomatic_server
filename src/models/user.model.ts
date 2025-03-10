import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: Number, required: false },
  otpExpires: { type: Date, required: false },
  isVerified: { type: Boolean, default: false },
});

export const User = mongoose.model("User", userSchema);
