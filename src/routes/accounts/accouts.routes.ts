import express from "express";
import { addAccount, removeAccount, getAccountsByInstitute } from "../../controllers/accountController/account.controller";
import { authenticateToken } from "../../middleware/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * /api/accounts/add-account:
 *   post:
 *     summary: Add a new account
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - platform
 *               - accessToken
 *             properties:
 *               platform:
 *                 type: string
 *                 enum: [facebook, instagram, twitter, linkedin, youtube]
 *               accessToken:
 *                 type: string
 *               refreshToken:
 *                 type: string
 *               accountId:
 *                 type: string
 *               accountName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Account added successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/add-account", authenticateToken, addAccount);

/**
 * @swagger
 * /api/accounts/remove-account/{id}:
 *   delete:
 *     summary: Remove an account
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Account ID
 *     responses:
 *       200:
 *         description: Account removed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Account not found
 */
router.delete("/remove-account/:id", authenticateToken, removeAccount);

/**
 * @swagger
 * /api/accounts/get-account:
 *   get:
 *     summary: Get accounts by institute
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Accounts retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/get-account", authenticateToken, getAccountsByInstitute);

export default router;
