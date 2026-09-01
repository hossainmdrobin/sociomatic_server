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
exports.getSocialAnalytics = void 0;
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const campaign_model_1 = __importDefault(require("../../../models/campaign.model"));
const post_model_1 = require("../../../models/post.model");
/* =========================================================
   ANALYTICS TOOL
========================================================= */
const benchmarkByPlatform = {
    facebook: { engagement: 3.8, conversion: 1.3 },
    instagram: { engagement: 5.2, conversion: 1.7 },
    tiktok: { engagement: 6.4, conversion: 1.2 },
    youtube: { engagement: 4.1, conversion: 2.1 },
    twitter: { engagement: 2.7, conversion: 1.1 },
    linkedin: { engagement: 2.4, conversion: 2.8 },
};
exports.getSocialAnalytics = (0, tools_1.tool)((_a) => __awaiter(void 0, [_a], void 0, function* ({ platform, instituteId, campaignId, days = 30, limit = 5, }) {
    var _b;
    try {
        const normalizedPlatform = platform ? platform.toLowerCase() : undefined;
        const query = {};
        if (instituteId) {
            query.institute = new mongoose_1.default.Types.ObjectId(instituteId);
        }
        if (campaignId) {
            query._id = new mongoose_1.default.Types.ObjectId(campaignId);
        }
        if (normalizedPlatform) {
            query.platforms = normalizedPlatform;
        }
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - Math.max(1, days));
        const campaigns = yield campaign_model_1.default.find(query)
            .select("name goals platforms stats createdAt")
            .sort({ createdAt: -1 })
            .lean();
        const postFilter = {
            stage: "published",
            publishedAt: { $gte: cutoff },
        };
        if (normalizedPlatform) {
            postFilter.platform = normalizedPlatform;
        }
        if (instituteId) {
            postFilter.institute = new mongoose_1.default.Types.ObjectId(instituteId);
        }
        if (campaignId) {
            postFilter.campaign = new mongoose_1.default.Types.ObjectId(campaignId);
        }
        const recentPosts = yield post_model_1.Post.find(postFilter)
            .select("text platform postType images videos publishedAt campaign")
            .sort({ publishedAt: -1 })
            .limit(50)
            .lean();
        const campaignStats = campaigns
            .map((campaign) => campaign.stats)
            .filter(Boolean)
            .map((stats) => {
            var _a, _b, _c, _d;
            return ({
                engagement: Number((_a = stats.engagement) !== null && _a !== void 0 ? _a : 0),
                clicks: Number((_b = stats.clicks) !== null && _b !== void 0 ? _b : 0),
                conversions: Number((_c = stats.conversions) !== null && _c !== void 0 ? _c : 0),
                totalPosts: Number((_d = stats.totalPosts) !== null && _d !== void 0 ? _d : 0),
            });
        });
        const avgEngagementRate = campaignStats.length
            ? campaignStats.reduce((sum, stat) => sum + stat.engagement, 0) / campaignStats.length
            : 0;
        const avgConversionRate = campaignStats.length
            ? campaignStats.reduce((sum, stat) => sum + stat.conversions, 0) / campaignStats.length
            : 0;
        const platformBenchmark = normalizedPlatform
            ? (_b = benchmarkByPlatform[normalizedPlatform]) !== null && _b !== void 0 ? _b : { engagement: 4, conversion: 1.5 }
            : { engagement: 4.2, conversion: 1.6 };
        const topPerformingContent = recentPosts.slice(0, limit).map((post) => {
            var _a, _b, _c, _d, _e, _f;
            return ({
                id: (_c = (_b = (_a = post._id) === null || _a === void 0 ? void 0 : _a.toString) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : "unknown",
                platform: post.platform,
                type: (_d = post.postType) !== null && _d !== void 0 ? _d : "image",
                publishedAt: post.publishedAt,
                contentPreview: (post.text || "Untitled post").slice(0, 120),
                estimatedEngagementRate: Math.max(0, Number((platformBenchmark.engagement * (((_e = post.images) === null || _e === void 0 ? void 0 : _e.length) ? 1.1 : 1) * (((_f = post.videos) === null || _f === void 0 ? void 0 : _f.length) ? 1.2 : 1)).toFixed(2))),
                estimatedConversionRate: Number((platformBenchmark.conversion * 0.9).toFixed(2)),
            });
        });
        const insights = [
            `${campaigns.length || 0} campaign(s) analyzed in the selected filter set.`,
            normalizedPlatform
                ? `Performance benchmark for ${normalizedPlatform} is ${platformBenchmark.engagement}% engagement and ${platformBenchmark.conversion}% conversion.`
                : `Default benchmark based on cross-platform averages: ${platformBenchmark.engagement}% engagement and ${platformBenchmark.conversion}% conversion.`,
            recentPosts.length
                ? `Recent content activity shows ${recentPosts.length} published post(s) in the selected period.`
                : "No published content was found in the selected period. The tool is using campaign history as the fallback signal.",
        ];
        const recommendations = [
            "Increase short-form native video content where the audience is more likely to engage.",
            "Repeat the winning content pattern in your best-performing platform for the next cycle.",
            "Use a stronger CTA in the first two lines of copy to improve conversion rate.",
        ];
        return {
            success: true,
            platform: normalizedPlatform !== null && normalizedPlatform !== void 0 ? normalizedPlatform : "all",
            periodDays: days,
            summary: {
                campaignsAnalyzed: campaigns.length,
                publishedPosts: recentPosts.length,
                averageEngagementRate: Number(avgEngagementRate.toFixed(2)),
                averageConversionRate: Number(avgConversionRate.toFixed(2)),
                benchmarkEngagementRate: Number(platformBenchmark.engagement.toFixed(2)),
                benchmarkConversionRate: Number(platformBenchmark.conversion.toFixed(2)),
            },
            topPerformingContent,
            insights,
            recommendations,
            dataSource: recentPosts.length ? "post_history" : "campaign_history_fallback",
        };
    }
    catch (error) {
        return {
            success: false,
            platform: platform !== null && platform !== void 0 ? platform : "all",
            error: `Failed to fetch social analytics: ${error instanceof Error ? error.message : "Unknown error"}`,
            topPerformingContent: [],
            engagementRate: 0,
            conversionRate: 0,
        };
    }
}), {
    name: "get_social_analytics",
    description: "Get historical campaign and post performance data for a social platform, plus engagement insights and recommendations.",
    schema: zod_1.z.object({
        platform: zod_1.z
            .string()
            .optional()
            .describe("Optional platform to focus on: facebook, instagram, tiktok, youtube, twitter, or linkedin."),
        instituteId: zod_1.z
            .string()
            .optional()
            .describe("Optional institute ID to scope analytics to a specific institute."),
        campaignId: zod_1.z
            .string()
            .optional()
            .describe("Optional campaign ID to scope analytics to a single campaign."),
        days: zod_1.z
            .number()
            .int()
            .positive()
            .max(365)
            .optional()
            .describe("How many days of history to review. Default is 30."),
        limit: zod_1.z
            .number()
            .int()
            .positive()
            .max(20)
            .optional()
            .describe("Maximum number of top-performing posts to return."),
    }),
});
