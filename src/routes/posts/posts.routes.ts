import express from "express";
import { authenticateToken } from "../../middleware/auth.middleware";
import { addTextPost, getPosts } from "./../../controllers/postController/posts.controller";

const router = express.Router();


router.get("/get-posts",authenticateToken,getPosts);
router.post("/add-post/text",authenticateToken,addTextPost );

export default router;
