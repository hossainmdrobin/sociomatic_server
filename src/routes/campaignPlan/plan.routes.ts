import express from "express";
import { createPlan, deletePlan, getAllPlans, getPlanById, updatePlan } from "../../controllers/campaignPlanController/campaignplan.controller";
import { authenticateToken } from "./../../middleware/auth.middleware";

const router = express.Router();

router.post("/",authenticateToken, createPlan);
router.get("/",authenticateToken, getAllPlans);
router.get("/:id",authenticateToken, getPlanById);
router.put("/:id",authenticateToken, updatePlan);
router.delete("/:id",authenticateToken, deletePlan);

export default router;