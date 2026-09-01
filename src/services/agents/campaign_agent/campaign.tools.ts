
import {tool} from '@langchain/core/tools'
import {z} from 'zod';
import Campaign from '../../../models/campaign.model';
import mongoose from 'mongoose';

/**
 * Get previous campaigns to learn from past successful campaigns
 * and avoid repeating the same content or strategies
 */
export const getPreviousCampaigns = tool(
  async ({ instituteId, limit = 5, status }: { instituteId: string; limit?: number; status?: string }) => {
    try {
      const query: any = { institute: new mongoose.Types.ObjectId(instituteId) };
      
      if (status) {
        query.status = status;
      } else {
        // Exclude drafts by default, get completed or active campaigns
        query.status = { $in: ["active", "completed"] };
      }

      const campaigns = await Campaign.find(query)
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
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch previous campaigns: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
  {
    name: "get_previous_campaigns",
    description:
      "Get previous campaigns to avoid repetitive content and learn what worked. Useful for understanding campaign patterns and successful strategies.",
    schema: z.object({
      instituteId: z.string().describe("The institute ID to fetch campaigns for"),
      limit: z.number().optional().describe("Maximum number of campaigns to return (default: 5)"),
      status: z.string().optional().describe("Filter by campaign status (e.g., 'active', 'completed', 'draft')"),
    }),
  }
);

/**
 * Get a specific campaign by ID with all details
 */
export const getCampaignDetails = tool(
  async ({ campaignId }: { campaignId: string }) => {
    try {
      const campaign = await Campaign.findById(campaignId)
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
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch campaign details: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
  {
    name: "get_campaign_details",
    description: "Get complete details about a specific campaign including products, goals, status, and generation tracking.",
    schema: z.object({
      campaignId: z.string().describe("The unique identifier of the campaign"),
    }),
  }
);

/**
 * Get all campaigns for an institute
 */
export const getCampaignsByInstitute = tool(
  async ({ instituteId, status }: { instituteId: string; status?: string }) => {
    try {
      const query: any = { institute: new mongoose.Types.ObjectId(instituteId) };
      
      if (status) {
        query.status = status;
      }

      const campaigns = await Campaign.find(query)
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
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch campaigns: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
  {
    name: "get_campaigns_by_institute",
    description: "Get all campaigns for a specific institute, optionally filtered by status.",
    schema: z.object({
      instituteId: z.string().describe("The institute ID"),
      status: z.string().optional().describe("Optional status filter (e.g., 'active', 'draft', 'completed')"),
    }),
  }
);

/**
 * Update campaign status or progress
 */
export const updateCampaignProgress = tool(
  async ({ campaignId, status, generatedPostCount, warningMessage }: { 
    campaignId: string; 
    status?: string;
    generatedPostCount?: number;
    warningMessage?: string;
  }) => {
    try {
      const updateData: any = {};
      
      if (status) updateData.status = status;
      if (generatedPostCount !== undefined) updateData.generatedPostCount = generatedPostCount;
      if (warningMessage) updateData.warningMessage = warningMessage;

      const campaign = await Campaign.findByIdAndUpdate(
        campaignId,
        updateData,
        { new: true, runValidators: true }
      ).lean();

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
    } catch (error) {
      return {
        success: false,
        error: `Failed to update campaign: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
  {
    name: "update_campaign_progress",
    description: "Update campaign status, post count, or warning messages during generation.",
    schema: z.object({
      campaignId: z.string().describe("The campaign ID to update"),
      status: z.string().optional().describe("New campaign status (e.g., 'generating', 'active', 'failed')"),
      generatedPostCount: z.number().optional().describe("Number of posts generated so far"),
      warningMessage: z.string().optional().describe("Warning message if any issues occurred"),
    }),
  }
);