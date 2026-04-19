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
exports.defineFinalizeCampaignJob = defineFinalizeCampaignJob;
const campaign_model_1 = __importDefault(require("../models/campaign.model"));
const post_model_1 = require("../models/post.model");
function defineFinalizeCampaignJob(agenda) {
    agenda.define("finalize-campaign", { priority: "normal", concurrency: 1 }, (job) => __awaiter(this, void 0, void 0, function* () {
        const data = job.attrs.data;
        const campaignId = data === null || data === void 0 ? void 0 : data.campaignId;
        const expectedBatches = data === null || data === void 0 ? void 0 : data.expectedBatches;
        console.log(`[FinalizeJob] Finalizing campaign: ${campaignId}`);
        try {
            yield new Promise((resolve) => setTimeout(resolve, 5000));
            const campaign = yield campaign_model_1.default.findById(campaignId);
            if (!campaign) {
                throw new Error(`Campaign not found: ${campaignId}`);
            }
            const actualPostCount = yield post_model_1.Post.countDocuments({ campaign: campaignId });
            console.log(`[FinalizeJob] Expected: ${campaign.expectedPostCount}, Actual: ${actualPostCount}`);
            campaign.status = actualPostCount > 0 ? "completed" : "failed";
            campaign.generatedPostCount = actualPostCount;
            if (actualPostCount < (campaign.expectedPostCount || 0)) {
                campaign.warningMessage = `Only ${actualPostCount} of ${campaign.expectedPostCount} posts were generated`;
            }
            yield campaign.save();
            console.log(`[FinalizeJob] Campaign finalized with status: ${campaign.status}`);
        }
        catch (error) {
            console.error(`[FinalizeJob] Error:`, error);
            yield campaign_model_1.default.findByIdAndUpdate(campaignId, {
                status: "failed",
                errorMessage: error.message,
            });
            throw error;
        }
    }));
}
exports.default = defineFinalizeCampaignJob;
