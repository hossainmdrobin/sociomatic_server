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
exports.campaignService = exports.CampaignService = void 0;
const campaign_model_1 = __importDefault(require("../models/campaign.model"));
const post_model_1 = require("../models/post.model");
const agenda_1 = __importDefault(require("../config/agenda"));
class CampaignService {
    startGeneration(campaignId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("start generation for campaign:", campaignId);
            const campaign = yield campaign_model_1.default.findById(campaignId);
            if (!campaign) {
                throw new Error("Campaign not found");
            }
            if (campaign.status === "generating" || campaign.status === "planning") {
                throw new Error("Campaign generation already in progress");
            }
            campaign.status = "planning";
            campaign.generatedPostCount = 0;
            campaign.expectedPostCount = 0;
            campaign.plan = [];
            yield campaign.save();
            yield agenda_1.default.cancel({ "data.campaignId": campaignId });
            yield agenda_1.default.now("generate-campaign-plan", { campaignId });
            console.log(`[CampaignService] Started generation for campaign: ${campaignId}`);
        });
    }
    getStatus(campaignId) {
        return __awaiter(this, void 0, void 0, function* () {
            const campaign = yield campaign_model_1.default.findById(campaignId);
            if (!campaign) {
                throw new Error("Campaign not found");
            }
            const expectedPosts = campaign.expectedPostCount || 0;
            const generatedPosts = campaign.generatedPostCount || 0;
            const progress = expectedPosts > 0 ? (generatedPosts / expectedPosts) * 100 : 0;
            return {
                status: campaign.status,
                expectedPosts,
                generatedPosts,
                progress: Math.min(progress, 100),
            };
        });
    }
    getPosts(campaignId_1) {
        return __awaiter(this, arguments, void 0, function* (campaignId, options = {}) {
            const { limit = 50, skip = 0 } = options;
            return post_model_1.Post.find({ campaign: campaignId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();
        });
    }
    deleteCampaignPosts(campaignId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield post_model_1.Post.deleteMany({ campaign: campaignId });
            return result.deletedCount || 0;
        });
    }
}
exports.CampaignService = CampaignService;
exports.campaignService = new CampaignService();
exports.default = exports.campaignService;
