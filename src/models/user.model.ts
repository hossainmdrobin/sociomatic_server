import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: Number, required: false },
  otpExpires: { type: Date, required: false },
  isVerified: { type: Boolean, default: false },
  accounts:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account"
  }]
},{
  timestamps: true
});

export const Admin = mongoose.model("Admin", adminSchema);
