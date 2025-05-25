import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  editor: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: false },
  text: { type: String, required: true },
  image:[{ type: String, required: false }],
  video:[{ type: String, required: false }],
  media: [{ type: String, required: true,default: "facebook", enum: ["facebook", "instagram", "twitter", "linkedin"] }],
}, {
  timestamps: true
});

export const Post = mongoose.model("Post", postSchema);
