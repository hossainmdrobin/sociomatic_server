import mongoose from "mongoose";

const instituteSchema = new mongoose.Schema({
  name: { type: String },
  slogan: { type: String },
  description: { type: String },
  type: { type: String },
  no_of_account: { type: Number, default: 0 },
  no_of_member: { type: Number, default: 1 },
  no_of_month_post: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const Institute = mongoose.model("Institute", instituteSchema);
