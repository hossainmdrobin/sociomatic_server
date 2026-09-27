import express from 'express';
import { authenticateToken } from "../../middleware/auth.middleware";
import { getNotication, updateNotication } from "../../controllers/notificationController/notification.controller";

const router = express.Router();

/**
 * @swagger
 * /api/notification/get_notification:
 *   get:
 *     summary: Get notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/get_notification", authenticateToken, getNotication);

/**
 * @swagger
 * /api/notification/update_notificaion:
 *   post:
 *     summary: Update notification settings
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailEnabled:
 *                 type: boolean
 *               pushEnabled:
 *                 type: boolean
 *               smsEnabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Notification settings updated
 *       401:
 *         description: Unauthorized
 */
router.post("/update_notificaion", authenticateToken, updateNotication);

export default router;
