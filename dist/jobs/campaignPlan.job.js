"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineCampaignPlanJob = defineCampaignPlanJob;
const planner_agent_1 = require("../services/agents/planner.agent");
const campaign_model_1 = __importDefault(require("../models/campaign.model"));
function defineCampaignPlanJob(agenda) {
    agenda.define("generate-campaign-plan", { priority: "high", concurrency: 1 }, (job) => __awaiter(this, void 0, void 0, function* () {
        const data = job.attrs.data;
        const campaignId = data === null || data === void 0 ? void 0 : data.campaignId;
        console.log(`[CampaignPlanJob] Starting plan generation for campaign: ${campaignId}`);
        console.log("Agenda: generate-campaign-plan");
        try {
            const campaign = (yield campaign_model_1.default.findById(campaignId).populate("products"));
            if (!campaign) {
                throw new Error(`Campaign not found: ${campaignId}`);
            }
            if (campaign.status === "completed") {
                console.log(`[CampaignPlanJob] Campaign already completed: ${campaignId}`);
                return;
            }
            campaign.status = "planning";
            yield campaign.save();
            const plan = yield planner_agent_1.plannerAgent.createPlan(campaign);
            campaign.plan = plan.themes;
            campaign.expectedPostCount = plan.totalPosts;
            yield campaign.save();
            console.log(`[CampaignPlanJob] Generated ${plan.themes.length} themes for ${plan.totalPosts} posts`);
            const batches = planner_agent_1.plannerAgent.splitIntoBatches(plan.themes, 5);
            for (let i = 0; i < batches.length; i++) {
                yield agenda.schedule("now", "generate-post-batch", {
                    campaignId,
                    themes: batches[i],
                    batchIndex: i,
                    totalBatches: batches.length,
                });
                console.log(`[CampaignPlanJob] Enqueued batch ${i + 1}/${batches.length}`);
            }
            yield agenda.schedule("in 5 minutes", "finalize-campaign", { campaignId, expectedBatches: batches.length });
        }
        catch (error) {
            console.error(`[CampaignPlanJob] Error:`, error);
            yield campaign_model_1.default.findByIdAndUpdate(campaignId, {
                status: "failed",
                errorMessage: error.message,
            });
            throw error;
        }
    }));
}
exports.default = defineCampaignPlanJob;
