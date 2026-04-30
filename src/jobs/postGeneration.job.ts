import { ICampaign } from "../models/campaign.model";
import { ICampaignPlan } from "../models/campaignPlan";
import { executorAgent } from "../services/agents/executor.agent";
import Campaign from "../models/campaign.model";
import CampaignPlan from "../models/campaignPlan";
import { Post } from "../models/post.model";

type Job<T = unknown> = {
  attrs: {
    data?: T;
    unique?: boolean;
    uniqueOpts?: Record<string, unknown>;
    disable?: boolean;
  };
};

interface PostGenerationJobData {
  campaignPlanId: string;
}

export function definePostGenerationJob(agenda: any): void {
  agenda.define(
    "generate-post-from-plan",
    { priority: "high", concurrency: 5 },
    async (job: Job<PostGenerationJobData>) => {
      const { campaignPlanId } = job.attrs.data!;

      console.log(`[PostGenerationJob] Generating posts for campaignPlan: ${campaignPlanId}`);

      try {
        const campaignPlanDoc = await CampaignPlan.findById(campaignPlanId)
          .populate("campaign")
          .populate("products")
          .populate("accounts");

        if (!campaignPlanDoc) {
          throw new Error(`CampaignPlan not found: ${campaignPlanId}`);
        }

        const campaign = campaignPlanDoc.campaign as unknown as ICampaign;
        if (!campaign) {
          throw new Error(`Campaign not found for campaignPlan: ${campaignPlanId}`);
        }

        const theme = {
          day: campaignPlanDoc.day,
          theme: campaignPlanDoc.planDescription,
          focusArea: campaignPlanDoc.products?.map((p: any) => p.name || p._id).join(", "),
        };

        const generatedPosts = await executorAgent.execute(campaign, [theme]);

        console.log(`[PostGenerationJob] Generated ${generatedPosts.length} posts`);

        const accountId = campaignPlanDoc.accounts?.[0]?.toString() || campaign.account?.toString();
        if (!accountId) {
          throw new Error(`No account found for campaignPlan: ${campaignPlanId}`);
        }

        const savedCount = await executorAgent.savePosts(
          generatedPosts,
          campaign._id.toString(),
          campaign.user.toString(),
          campaign.institute.toString(),
          accountId
        );

        console.log(`[PostGenerationJob] Saved ${savedCount} posts to database`);

        const actualCount = await Post.countDocuments({ campaign: campaign._id });
        await Campaign.findByIdAndUpdate(campaign._id, {
          generatedPostCount: actualCount,
        });
      } catch (error) {
        console.error(`[PostGenerationJob] Error:`, error);
        throw error;
      }
    }
  );
}

export default definePostGenerationJob;
