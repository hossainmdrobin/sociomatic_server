import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: Number, required: false },
  otpExpires: { type: Date, required: false },
  isVerified: { type: Boolean, default: false },
},{
  timestamps: true
});

export const User = mongoose.model("User", userSchema);
