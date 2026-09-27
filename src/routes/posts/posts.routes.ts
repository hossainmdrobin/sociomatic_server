import express from "express";
import { authenticateToken } from "../../middleware/auth.middleware";
import {
    addTextPost,
    createPostNow,
    getPostByCampaign,
    getPosts,
    savePostWithFiles,
    updatePostById
} from "./../../controllers/postController/posts.controller";
import { upload } from "../../middleware/uploads";

const router = express.Router();

/**
 * @swagger
 * /api/posts/get-posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/get-posts", authenticateToken, getPosts);

/**
 * @swagger
 * /api/posts/add-post/text:
 *   post:
 *     summary: Add a text post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               campaignId:
 *                 type: string
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Text post created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/add-post/text", authenticateToken, addTextPost);

/**
 * @swagger
 * /api/posts/add_post:
 *   post:
 *     summary: Add a post with files
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - files
 *             properties:
 *               content:
 *                 type: string
 *               campaignId:
 *                 type: string
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Post with files created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/add_post", authenticateToken, upload.array("files", 10), savePostWithFiles);

/**
 * @swagger
 * /api/posts/post-now:
 *   post:
 *     summary: Create and publish a post immediately
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               platform:
 *                 type: string
 *               accountId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post published successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/post-now", authenticateToken, createPostNow);

/**
 * @swagger
 * /api/posts/update-post/{id}:
 *   post:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
router.post("/update-post/:id", authenticateToken, updatePostById);

/**
 * @swagger
 * /api/posts/get-post-by-campaign/{id}:
 *   get:
 *     summary: Get posts by campaign ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign ID
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Campaign not found
 */
router.get("/get-post-by-campaign/:id", authenticateToken, getPostByCampaign);

export default router;
