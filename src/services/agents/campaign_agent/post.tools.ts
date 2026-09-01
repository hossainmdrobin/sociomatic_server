import { tool } from "@langchain/core/tools";
import { z } from "zod";
import mongoose from "mongoose";
import { Post } from "../../../models/post.model";

/* =========================================================
   POST TOOL
========================================================= */

export const createPost = tool(
  async ({
    instituteId,
    creatorId,
    adminId,
    accountId,
    campaignId,
    text,
    platform,
    stage = "draft",
    postType,
    images = [],
    videos = [],
    tags = [],
    labels = [],
    budget,
    scheduledAt,
    publishedAt,
  }: {
    instituteId: string;
    creatorId: string;
    adminId?: string;
    accountId?: string;
    campaignId?: string;
    text: string;
    platform: "facebook" | "instagram" | "twitter" | "linkedin" | "youtube";
    stage?: "draft" | "saved" | "published" | "deleted" | "scheduled";
    postType?: "text" | "image" | "video" | "link";
    images?: string[];
    videos?: string[];
    tags?: string[];
    labels?: string[];
    budget?: number;
    scheduledAt?: string;
    publishedAt?: string;
  }) => {
    try {
      const payload: any = {
        institute: new mongoose.Types.ObjectId(instituteId),
        creator: new mongoose.Types.ObjectId(creatorId),
        text,
        platform,
        stage,
        images,
        videos,
        tags,
        labels,
      };

      if (adminId) {
        payload.admin = new mongoose.Types.ObjectId(adminId);
      }

      if (accountId) {
        payload.account = new mongoose.Types.ObjectId(accountId);
      }

      if (campaignId) {
        payload.campaign = new mongoose.Types.ObjectId(campaignId);
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

      const newPost = await Post.create(payload);

      return {
        success: true,
        message: "Post created successfully",
        post: {
          id: newPost._id.toString(),
          campaign: newPost.campaign?.toString?.() ?? null,
          institute: newPost.institute?.toString?.() ?? null,
          creator: newPost.creator?.toString?.() ?? null,
          admin: newPost.admin?.toString?.() ?? null,
          account: newPost.account?.toString?.() ?? null,
          text: newPost.text,
          platform: newPost.platform,
          stage: newPost.stage,
          postType: newPost.postType,
          images: newPost.images ?? [],
          videos: newPost.videos ?? [],
          tags: newPost.tags ?? [],
          labels: newPost.labels ?? [],
          budget: newPost.budget ?? 0,
          scheduledAt: newPost.scheduledAt,
          publishedAt: newPost.publishedAt,
          createdAt: newPost.createdAt,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create post: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
  {
    name: "create_post",
    description:
      "Create a new social media post record in the database for a campaign, channel, and institute.",
    schema: z.object({
      instituteId: z.string().describe("ID of the institute owning the post."),
      creatorId: z.string().describe("ID of the admin or creator that wrote the post."),
      adminId: z.string().optional().describe("Optional admin ID for the post owner or approver."),
      accountId: z.string().optional().describe("Optional linked social account ID."),
      campaignId: z.string().optional().describe("Optional campaign ID this post belongs to."),
      text: z.string().describe("Main post content or caption."),
      platform: z.enum(["facebook", "instagram", "twitter", "linkedin", "youtube"]).describe("Platform for the post."),
      stage: z.enum(["draft", "saved", "published", "deleted", "scheduled"]).optional().describe("Current stage of the post."),
      postType: z.enum(["text", "image", "video", "link"]).optional().describe("Post format."),
      images: z.array(z.string()).optional().describe("Image URLs attached to this post."),
      videos: z.array(z.string()).optional().describe("Video URLs attached to this post."),
      tags: z.array(z.string()).optional().describe("Hashtags or keywords for this post."),
      labels: z.array(z.string()).optional().describe("Content labels or categories."),
      budget: z.number().optional().describe("Budget assigned to this post."),
      scheduledAt: z.string().optional().describe("Scheduled publish datetime in ISO format."),
      publishedAt: z.string().optional().describe("Published datetime in ISO format."),
    }),
  }
);

export const updatePostStage = tool(
  async ({
    postId,
    stage,
    scheduledAt,
    publishedAt,
    notes,
  }: {
    postId: string;
    stage: "draft" | "saved" | "published" | "deleted" | "scheduled";
    scheduledAt?: string;
    publishedAt?: string;
    notes?: string;
  }) => {
    try {
      const updateData: any = {
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
          user: new mongoose.Types.ObjectId(),
          text: notes,
          createdAt: new Date(),
        }];
      }

      const updatedPost = await Post.findByIdAndUpdate(postId, updateData, {
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
    } catch (error) {
      return {
        success: false,
        error: `Failed to update post stage: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
  {
    name: "update_post_stage",
    description: "Update a post's stage between draft, saved, scheduled, and published states and optionally set publish dates.",
    schema: z.object({
      postId: z.string().describe("The post ID to update."),
      stage: z.enum(["draft", "saved", "published", "deleted", "scheduled"]).describe("The new post stage."),
      scheduledAt: z.string().optional().describe("Optional scheduled publish datetime in ISO format."),
      publishedAt: z.string().optional().describe("Optional published datetime in ISO format."),
      notes: z.string().optional().describe("Optional internal note or comment to attach to the post."),
    }),
  }
);
