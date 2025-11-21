import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // user who receives the notif
  title: String,
  message: String,
  action: String, // e.g., "OPEN_POST", "FOLLOW_USER"
  link: String,   // URL or app route
  read: { type: Boolean, default: false },
  createdAt: Date,
}, {
  timestamps: true
})

export const Notificaiton = mongoose.model("Notificaiton", notificationSchema);