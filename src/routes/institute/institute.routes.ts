import { authenticateToken } from "./../../middleware/auth.middleware";
import { createInstitute, deleteInstitute, getInstitute, getInstitutes, updateInstitute } from "./../../controllers/instituteController/institute.controller";
import express from "express";

const router = express.Router();

/**
 * @swagger
 * /api/institute:
 *   post:
 *     summary: Create a new institute
 *     tags: [Institute]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Institute created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", createInstitute);

/**
 * @swagger
 * /api/institute:
 *   get:
 *     summary: Get all institutes
 *     tags: [Institute]
 *     responses:
 *       200:
 *         description: Institutes retrieved successfully
 */
router.get("/", getInstitutes);

/**
 * @swagger
 * /api/institute:
 *   put:
 *     summary: Update institute
 *     tags: [Institute]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Institute updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/", authenticateToken, updateInstitute);

/**
 * @swagger
 * /api/institute/{id}:
 *   get:
 *     summary: Get institute by ID
 *     tags: [Institute]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Institute ID
 *     responses:
 *       200:
 *         description: Institute retrieved successfully
 *       404:
 *         description: Institute not found
 */
router.get("/:id", getInstitute);

/**
 * @swagger
 * /api/institute/{id}:
 *   delete:
 *     summary: Delete institute
 *     tags: [Institute]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Institute ID
 *     responses:
 *       200:
 *         description: Institute deleted successfully
 *       404:
 *         description: Institute not found
 */
router.delete("/:id", deleteInstitute);

export default router;