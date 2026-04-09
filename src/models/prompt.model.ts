import mongoose from "mongoose";

const promptSchema = new mongoose.Schema(
  {
    bussiness: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Institute",
    },
    type: { type: String },
    tone: { type: String },
    length: { type: String },
    language: { type: String },
    products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
    description: { type: String },
    image: { type: Boolean },
    imageType: { type: String },
    imageSize: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Prompt = mongoose.model("Prompt", promptSchema);