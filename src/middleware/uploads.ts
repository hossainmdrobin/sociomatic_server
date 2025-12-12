// src/middlewares/upload.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isVideo = file.mimetype.startsWith("video");
    return {
      folder: isVideo ? "videos" : "images",   // store separately
      resource_type: isVideo ? "video" : "image",
      public_id: Date.now().toString(),
    };
  }
});

export const upload = multer({ storage });
