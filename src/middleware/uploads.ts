// src/middlewares/upload.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "uploads"; // default folder
    let resource_type: "image" | "video" | "raw" | "auto" = "auto";

    return {
      folder,
      resource_type,       // automatically detects image/video
      public_id: Date.now().toString(),
    };
  },
});

export const upload = multer({ storage });
