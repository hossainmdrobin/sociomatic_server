import { Job } from "agenda";
import { ICampaign } from "../models/campaign.model";
import { executorAgent } from "../services/agents/executor.agent";
import { Theme } from "../services/agents/planner.agent";
import agenda from "../config/agenda";
import Campaign from "../models/campaign.model";
import { Post } from "../models/post.model";

interface PostBatchJobData {
  campaignId: string;
  themes: Theme[];
  batchIndex: number;
  totalBatches: number;
}

export function definePostBatchJob(): void {
  agenda.define(
    "generate-post-batch",
    { priority: "high", concurrency: 5 },
    async (job: Job<PostBatchJobData>) => {
      const { campaignId, themes, batchIndex, totalBatches } = job.attrs.data;

      console.log(`[PostBatchJob] Processing batch ${batchIndex + 1}/${totalBatches} for campaign: ${campaignId}`);

      try {
        const campaign = (await Campaign.findById(campaignId).populate("products")) as ICampaign;

        if (!campaign) {
          throw new Error(`Campaign not found: ${campaignId}`);
        }

        const generatedPosts = await executorAgent.execute(campaign, themes);

        console.log(`[PostBatchJob] Generated ${generatedPosts.length} posts`);

        const savedCount = await executorAgent.savePosts(
          generatedPosts,
          campaignId,
          campaign.user.toString(),
          campaign.institute.toString(),
          campaign.account.toString()
        );

        console.log(`[PostBatchJob] Saved ${savedCount} posts to database`);

        const actualCount = await Post.countDocuments({ campaign: campaignId });
        await Campaign.findByIdAndUpdate(campaignId, {
          generatedPostCount: actualCount,
        });
      } catch (error) {
        console.error(`[PostBatchJob] Error:`, error);
        throw error;
      }
    }
  );
}

export default definePostBatchJob;
