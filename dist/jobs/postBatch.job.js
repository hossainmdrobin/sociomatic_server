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
exports.definePostBatchJob = definePostBatchJob;
const executor_agent_1 = require("../services/agents/executor.agent");
const campaign_model_1 = __importDefault(require("../models/campaign.model"));
const post_model_1 = require("../models/post.model");
function definePostBatchJob(agenda) {
    agenda.define("generate-post-batch", { priority: "high", concurrency: 5 }, (job) => __awaiter(this, void 0, void 0, function* () {
        const data = job.attrs.data;
        const campaignId = data === null || data === void 0 ? void 0 : data.campaignId;
        const themes = data === null || data === void 0 ? void 0 : data.themes;
        const batchIndex = data === null || data === void 0 ? void 0 : data.batchIndex;
        const totalBatches = data === null || data === void 0 ? void 0 : data.totalBatches;
        console.log(`[PostBatchJob] Processing batch ${batchIndex + 1}/${totalBatches} for campaign: ${campaignId}`);
        try {
            const campaign = (yield campaign_model_1.default.findById(campaignId).populate("products"));
            if (!campaign) {
                throw new Error(`Campaign not found: ${campaignId}`);
            }
            const generatedPosts = yield executor_agent_1.executorAgent.execute(campaign, themes);
            console.log(`[PostBatchJob] Generated ${generatedPosts.length} posts`);
            const savedCount = yield executor_agent_1.executorAgent.savePosts(generatedPosts, campaignId, campaign.user.toString(), campaign.institute.toString(), campaign.account.toString());
            console.log(`[PostBatchJob] Saved ${savedCount} posts to database`);
            const actualCount = yield post_model_1.Post.countDocuments({ campaign: campaignId });
            yield campaign_model_1.default.findByIdAndUpdate(campaignId, {
                generatedPostCount: actualCount,
            });
        }
        catch (error) {
            console.error(`[PostBatchJob] Error:`, error);
            throw error;
        }
    }));
}
exports.default = definePostBatchJob;
