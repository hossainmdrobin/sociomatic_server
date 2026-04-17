"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const campaignplan_controller_1 = require("../../controllers/campaignPlanController/campaignplan.controller");
const auth_middleware_1 = require("./../../middleware/auth.middleware");
const router = express_1.default.Router();
router.post("/", auth_middleware_1.authenticateToken, campaignplan_controller_1.createPlan);
router.get("/", auth_middleware_1.authenticateToken, campaignplan_controller_1.getAllPlans);
router.get("/:id", auth_middleware_1.authenticateToken, campaignplan_controller_1.getPlanById);
router.put("/:id", auth_middleware_1.authenticateToken, campaignplan_controller_1.updatePlan);
router.delete("/:id", auth_middleware_1.authenticateToken, campaignplan_controller_1.deletePlan);
exports.default = router;
