import express from "express";
import { authenticateToken } from "../../middleware/auth.middleware";
import { addTextPost, createPostNow, getPosts, updatePostById } from "./../../controllers/postController/posts.controller";

const router = express.Router();


router.get("/get-posts",authenticateToken,getPosts);
router.post("/add-post/text",authenticateToken,addTextPost );
router.post("/post-now", authenticateToken, createPostNow)
router.post("/update-post/:id", authenticateToken,updatePostById);

export default router;
