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
exports.updateCampaignProgress = exports.getCampaignsByInstitute = exports.getCampaignDetails = exports.getPreviousCampaigns = void 0;
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const campaign_model_1 = __importDefault(require("../../../models/campaign.model"));
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Get previous campaigns to learn from past successful campaigns
 * and avoid repeating the same content or strategies
 */
exports.getPreviousCampaigns = (0, tools_1.tool)((_a) => __awaiter(void 0, [_a], void 0, function* ({ instituteId, limit = 5, status }) {
    try {
        const query = { institute: new mongoose_1.default.Types.ObjectId(instituteId) };
        if (status) {
            query.status = status;
        }
        else {
            // Exclude drafts by default, get completed or active campaigns
            query.status = { $in: ["active", "completed"] };
        }
        const campaigns = yield campaign_model_1.default.find(query)
            .populate("products", "name description category price")
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
        if (campaigns.length === 0) {
            return {
                success: true,
                campaigns: [],
                message: "No previous campaigns found to learn from",
            };
        }
        return {
            success: true,
            count: campaigns.length,
            campaigns: campaigns.map((campaign) => ({
                id: campaign._id.toString(),
                name: campaign.name,
                goals: campaign.goals,
                description: campaign.description,
                platforms: campaign.platforms,
                postsPerDay: campaign.postsPerDay,
                duration: campaign.duration,
                tone: campaign.tone,
                language: campaign.language,
                status: campaign.status,
                products: campaign.products,
                stats: campaign.stats,
                generatedPostCount: campaign.generatedPostCount,
                createdAt: campaign.createdAt,
            })),
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Failed to fetch previous campaigns: ${error instanceof Error ? error.message : "Unknown error"}`,
        };
    }
}), {
    name: "get_previous_campaigns",
    description: "Get previous campaigns to avoid repetitive content and learn what worked. Useful for understanding campaign patterns and successful strategies.",
    schema: zod_1.z.object({
        instituteId: zod_1.z.string().describe("The institute ID to fetch campaigns for"),
        limit: zod_1.z.number().optional().describe("Maximum number of campaigns to return (default: 5)"),
        status: zod_1.z.string().optional().describe("Filter by campaign status (e.g., 'active', 'completed', 'draft')"),
    }),
});
/**
 * Get a specific campaign by ID with all details
 */
exports.getCampaignDetails = (0, tools_1.tool)((_a) => __awaiter(void 0, [_a], void 0, function* ({ campaignId }) {
    try {
        const campaign = yield campaign_model_1.default.findById(campaignId)
            .populate("products", "name description category price brand material features")
            .populate("user", "name email")
            .lean();
        if (!campaign) {
            return {
                success: false,
                error: `Campaign with ID ${campaignId} not found`,
            };
        }
        return {
            success: true,
            campaign: {
                id: campaign._id.toString(),
                name: campaign.name,
                goals: campaign.goals,
                description: campaign.description,
                platforms: campaign.platforms,
                postsPerDay: campaign.postsPerDay,
                duration: campaign.duration,
                startsFrom: campaign.startsFrom,
                tone: campaign.tone,
                language: campaign.language,
                status: campaign.status,
                products: campaign.products,
                stats: campaign.stats,
                plan: campaign.plan,
                expectedPostCount: campaign.expectedPostCount,
                generatedPostCount: campaign.generatedPostCount,
                errorMessage: campaign.errorMessage,
                warningMessage: campaign.warningMessage,
                aiModel: campaign.aiModel,
                createdAt: campaign.createdAt,
                updatedAt: campaign.updatedAt,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Failed to fetch campaign details: ${error instanceof Error ? error.message : "Unknown error"}`,
        };
    }
}), {
    name: "get_campaign_details",
    description: "Get complete details about a specific campaign including products, goals, status, and generation tracking.",
    schema: zod_1.z.object({
        campaignId: zod_1.z.string().describe("The unique identifier of the campaign"),
    }),
});
/**
 * Get all campaigns for an institute
 */
exports.getCampaignsByInstitute = (0, tools_1.tool)((_a) => __awaiter(void 0, [_a], void 0, function* ({ instituteId, status }) {
    try {
        const query = { institute: new mongoose_1.default.Types.ObjectId(instituteId) };
        if (status) {
            query.status = status;
        }
        const campaigns = yield campaign_model_1.default.find(query)
            .populate("products", "name category")
            .sort({ createdAt: -1 })
            .lean();
        if (campaigns.length === 0) {
            return {
                success: true,
                campaigns: [],
                message: "No campaigns found for this institute",
            };
        }
        return {
            success: true,
            count: campaigns.length,
            campaigns: campaigns.map((campaign) => ({
                id: campaign._id.toString(),
                name: campaign.name,
                goals: campaign.goals,
                platforms: campaign.platforms,
                status: campaign.status,
                postsPerDay: campaign.postsPerDay,
                duration: campaign.duration,
                generatedPostCount: campaign.generatedPostCount,
                createdAt: campaign.createdAt,
            })),
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Failed to fetch campaigns: ${error instanceof Error ? error.message : "Unknown error"}`,
        };
    }
}), {
    name: "get_campaigns_by_institute",
    description: "Get all campaigns for a specific institute, optionally filtered by status.",
    schema: zod_1.z.object({
        instituteId: zod_1.z.string().describe("The institute ID"),
        status: zod_1.z.string().optional().describe("Optional status filter (e.g., 'active', 'draft', 'completed')"),
    }),
});
/**
 * Update campaign status or progress
 */
exports.updateCampaignProgress = (0, tools_1.tool)((_a) => __awaiter(void 0, [_a], void 0, function* ({ campaignId, status, generatedPostCount, warningMessage }) {
    try {
        const updateData = {};
        if (status)
            updateData.status = status;
        if (generatedPostCount !== undefined)
            updateData.generatedPostCount = generatedPostCount;
        if (warningMessage)
            updateData.warningMessage = warningMessage;
        const campaign = yield campaign_model_1.default.findByIdAndUpdate(campaignId, updateData, { new: true, runValidators: true }).lean();
        if (!campaign) {
            return {
                success: false,
                error: `Campaign with ID ${campaignId} not found`,
            };
        }
        return {
            success: true,
            message: "Campaign updated successfully",
            campaign: {
                id: campaign._id.toString(),
                name: campaign.name,
                status: campaign.status,
                generatedPostCount: campaign.generatedPostCount,
                warningMessage: campaign.warningMessage,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Failed to update campaign: ${error instanceof Error ? error.message : "Unknown error"}`,
        };
    }
}), {
    name: "update_campaign_progress",
    description: "Update campaign status, post count, or warning messages during generation.",
    schema: zod_1.z.object({
        campaignId: zod_1.z.string().describe("The campaign ID to update"),
        status: zod_1.z.string().optional().describe("New campaign status (e.g., 'generating', 'active', 'failed')"),
        generatedPostCount: zod_1.z.number().optional().describe("Number of posts generated so far"),
        warningMessage: zod_1.z.string().optional().describe("Warning message if any issues occurred"),
    }),
});
