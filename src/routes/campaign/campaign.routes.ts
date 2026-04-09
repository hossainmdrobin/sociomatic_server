import { Router } from "express";
import {
    createCampaign,
    getAllCampaigns,
    getCampaignById,
    getCampaignsByUser,
    updateCampaign,
    deleteCampaign,
    updateCampaignStatus,
    updateCampaignStats,
} from "./../../controllers/campaignController/campaign.controller";
import { authenticateToken } from "../../middleware/auth.middleware";

const router = Router();

router.post("/", authenticateToken, createCampaign);
router.get("/", authenticateToken, getAllCampaigns);
router.get("/user/:userId", authenticateToken, getCampaignsByUser);
router.get("/:id", authenticateToken, getCampaignById);
router.put("/:id", authenticateToken, updateCampaign);
router.delete("/:id", authenticateToken, deleteCampaign);
router.patch("/:id/status", authenticateToken, updateCampaignStatus);
router.patch("/:id/stats", authenticateToken, updateCampaignStats);

export default router;