import Campaign from "../models/campaign.model";
import { Post } from "../models/post.model";
import agenda from "../config/agenda";

export class CampaignService {
  async startGeneration(campaignId: string): Promise<void> {
    const campaign = await Campaign.findById(campaignId);

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
    await campaign.save();

    await agenda.cancel({ "data.campaignId": campaignId });

    await agenda.now("generate-campaign-plan", { campaignId });

    console.log(`[CampaignService] Started generation for campaign: ${campaignId}`);
  }

  async getStatus(campaignId: string): Promise<{
    status: string;
    expectedPosts: number;
    generatedPosts: number;
    progress: number;
  }> {
    const campaign = await Campaign.findById(campaignId);

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
  }

  async getPosts(campaignId: string, options: { limit?: number; skip?: number } = {}): Promise<any[]> {
    const { limit = 50, skip = 0 } = options;

    return Post.find({ campaign: campaignId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async deleteCampaignPosts(campaignId: string): Promise<number> {
    const result = await Post.deleteMany({ campaign: campaignId });
    return result.deletedCount || 0;
  }
}

export const campaignService = new CampaignService();
export default campaignService;
