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
exports.updatePostStage = exports.createPost = void 0;
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const post_model_1 = require("../../../models/post.model");
/* =========================================================
   POST TOOL
========================================================= */
exports.createPost = (0, tools_1.tool)((_a) => __awaiter(void 0, [_a], void 0, function* ({ instituteId, creatorId, adminId, accountId, campaignId, text, platform, stage = "draft", postType, images = [], videos = [], tags = [], labels = [], budget, scheduledAt, publishedAt, }) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    try {
        const payload = {
            institute: new mongoose_1.default.Types.ObjectId(instituteId),
            creator: new mongoose_1.default.Types.ObjectId(creatorId),
            text,
            platform,
            stage,
            images,
            videos,
            tags,
            labels,
        };
        if (adminId) {
            payload.admin = new mongoose_1.default.Types.ObjectId(adminId);
        }
        if (accountId) {
            payload.account = new mongoose_1.default.Types.ObjectId(accountId);
        }
        if (campaignId) {
            payload.campaign = new mongoose_1.default.Types.ObjectId(campaignId);
        }
        if (postType) {
            payload.postType = postType;
        }
        if (budget !== undefined) {
            payload.budget = budget;
        }
        if (scheduledAt) {
            payload.scheduledAt = new Date(scheduledAt);
        }
        if (publishedAt) {
            payload.publishedAt = new Date(publishedAt);
        }
        const newPost = yield post_model_1.Post.create(payload);
        return {
            success: true,
            message: "Post created successfully",
            post: {
                id: newPost._id.toString(),
                campaign: (_d = (_c = (_b = newPost.campaign) === null || _b === void 0 ? void 0 : _b.toString) === null || _c === void 0 ? void 0 : _c.call(_b)) !== null && _d !== void 0 ? _d : null,
                institute: (_g = (_f = (_e = newPost.institute) === null || _e === void 0 ? void 0 : _e.toString) === null || _f === void 0 ? void 0 : _f.call(_e)) !== null && _g !== void 0 ? _g : null,
                creator: (_k = (_j = (_h = newPost.creator) === null || _h === void 0 ? void 0 : _h.toString) === null || _j === void 0 ? void 0 : _j.call(_h)) !== null && _k !== void 0 ? _k : null,
                admin: (_o = (_m = (_l = newPost.admin) === null || _l === void 0 ? void 0 : _l.toString) === null || _m === void 0 ? void 0 : _m.call(_l)) !== null && _o !== void 0 ? _o : null,
                account: (_r = (_q = (_p = newPost.account) === null || _p === void 0 ? void 0 : _p.toString) === null || _q === void 0 ? void 0 : _q.call(_p)) !== null && _r !== void 0 ? _r : null,
                text: newPost.text,
                platform: newPost.platform,
                stage: newPost.stage,
                postType: newPost.postType,
                images: (_s = newPost.images) !== null && _s !== void 0 ? _s : [],
                videos: (_t = newPost.videos) !== null && _t !== void 0 ? _t : [],
                tags: (_u = newPost.tags) !== null && _u !== void 0 ? _u : [],
                labels: (_v = newPost.labels) !== null && _v !== void 0 ? _v : [],
                budget: (_w = newPost.budget) !== null && _w !== void 0 ? _w : 0,
                scheduledAt: newPost.scheduledAt,
                publishedAt: newPost.publishedAt,
                createdAt: newPost.createdAt,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Failed to create post: ${error instanceof Error ? error.message : "Unknown error"}`,
        };
    }
}), {
    name: "create_post",
    description: "Create a new social media post record in the database for a campaign, channel, and institute.",
    schema: zod_1.z.object({
        instituteId: zod_1.z.string().describe("ID of the institute owning the post."),
        creatorId: zod_1.z.string().describe("ID of the admin or creator that wrote the post."),
        adminId: zod_1.z.string().optional().describe("Optional admin ID for the post owner or approver."),
        accountId: zod_1.z.string().optional().describe("Optional linked social account ID."),
        campaignId: zod_1.z.string().optional().describe("Optional campaign ID this post belongs to."),
        text: zod_1.z.string().describe("Main post content or caption."),
        platform: zod_1.z.enum(["facebook", "instagram", "twitter", "linkedin", "youtube"]).describe("Platform for the post."),
        stage: zod_1.z.enum(["draft", "saved", "published", "deleted", "scheduled"]).optional().describe("Current stage of the post."),
        postType: zod_1.z.enum(["text", "image", "video", "link"]).optional().describe("Post format."),
        images: zod_1.z.array(zod_1.z.string()).optional().describe("Image URLs attached to this post."),
        videos: zod_1.z.array(zod_1.z.string()).optional().describe("Video URLs attached to this post."),
        tags: zod_1.z.array(zod_1.z.string()).optional().describe("Hashtags or keywords for this post."),
        labels: zod_1.z.array(zod_1.z.string()).optional().describe("Content labels or categories."),
        budget: zod_1.z.number().optional().describe("Budget assigned to this post."),
        scheduledAt: zod_1.z.string().optional().describe("Scheduled publish datetime in ISO format."),
        publishedAt: zod_1.z.string().optional().describe("Published datetime in ISO format."),
    }),
});
exports.updatePostStage = (0, tools_1.tool)((_a) => __awaiter(void 0, [_a], void 0, function* ({ postId, stage, scheduledAt, publishedAt, notes, }) {
    try {
        const updateData = {
            stage,
        };
        if (scheduledAt) {
            updateData.scheduledAt = new Date(scheduledAt);
        }
        if (publishedAt) {
            updateData.publishedAt = new Date(publishedAt);
        }
        if (notes) {
            updateData.comments = [{
                    user: new mongoose_1.default.Types.ObjectId(),
                    text: notes,
                    createdAt: new Date(),
                }];
        }
        const updatedPost = yield post_model_1.Post.findByIdAndUpdate(postId, updateData, {
            new: true,
            runValidators: true,
        }).lean();
        if (!updatedPost) {
            return {
                success: false,
                error: `Post with ID ${postId} not found`,
            };
        }
        return {
            success: true,
            message: `Post stage updated to ${stage}`,
            post: {
                id: updatedPost._id.toString(),
                text: updatedPost.text,
                platform: updatedPost.platform,
                stage: updatedPost.stage,
                scheduledAt: updatedPost.scheduledAt,
                publishedAt: updatedPost.publishedAt,
                updatedAt: updatedPost.updatedAt,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Failed to update post stage: ${error instanceof Error ? error.message : "Unknown error"}`,
        };
    }
}), {
    name: "update_post_stage",
    description: "Update a post's stage between draft, saved, scheduled, and published states and optionally set publish dates.",
    schema: zod_1.z.object({
        postId: zod_1.z.string().describe("The post ID to update."),
        stage: zod_1.z.enum(["draft", "saved", "published", "deleted", "scheduled"]).describe("The new post stage."),
        scheduledAt: zod_1.z.string().optional().describe("Optional scheduled publish datetime in ISO format."),
        publishedAt: zod_1.z.string().optional().describe("Optional published datetime in ISO format."),
        notes: zod_1.z.string().optional().describe("Optional internal note or comment to attach to the post."),
    }),
});
