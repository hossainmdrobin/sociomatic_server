import express from "express";
import { authenticateToken } from "../../middleware/auth.middleware";
import { addTextPost, createPostNow, getPosts, savePostWithFiles, updatePostById } from "./../../controllers/postController/posts.controller";
import { upload } from "../../middleware/uploads";

const router = express.Router();


router.get("/get-posts", authenticateToken, getPosts);
router.post("/add-post/text", authenticateToken, addTextPost);
router.post("/add_post", authenticateToken, upload.array("files", 10), savePostWithFiles);
router.post("/post-now", authenticateToken, createPostNow);
router.post("/update-post/:id", authenticateToken, updatePostById);

export default router;
