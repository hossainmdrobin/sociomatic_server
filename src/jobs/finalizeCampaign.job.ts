import agenda from "../config/agenda";
import Campaign from "../models/campaign.model";
import { Post } from "../models/post.model";

type Job<T = unknown> = {
  attrs: {
    data?: T;
    unique?: boolean;
    uniqueOpts?: Record<string, unknown>;
    disable?: boolean;
  };
};

interface FinalizeJobData {
  campaignId: string;
  expectedBatches: number;
}

export function defineFinalizeCampaignJob(): void {
  agenda.define(
    "finalize-campaign",
    { priority: "normal", concurrency: 1 },
    async (job: Job<FinalizeJobData>) => {
      const data = job.attrs.data!;
      const campaignId = data?.campaignId;
      const expectedBatches = data?.expectedBatches;

      console.log(`[FinalizeJob] Finalizing campaign: ${campaignId}`);

      try {
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const campaign = await Campaign.findById(campaignId);

        if (!campaign) {
          throw new Error(`Campaign not found: ${campaignId}`);
        }

        const actualPostCount = await Post.countDocuments({ campaign: campaignId });

        console.log(`[FinalizeJob] Expected: ${campaign.expectedPostCount}, Actual: ${actualPostCount}`);

        campaign.status = actualPostCount > 0 ? "completed" : "failed";
        campaign.generatedPostCount = actualPostCount;

        if (actualPostCount < (campaign.expectedPostCount || 0)) {
          campaign.warningMessage = `Only ${actualPostCount} of ${campaign.expectedPostCount} posts were generated`;
        }

        await campaign.save();

        console.log(`[FinalizeJob] Campaign finalized with status: ${campaign.status}`);
      } catch (error) {
        console.error(`[FinalizeJob] Error:`, error);

        await Campaign.findByIdAndUpdate(campaignId, {
          status: "failed",
          errorMessage: (error as Error).message,
        });

        throw error;
      }
    }
  );
}

export default defineFinalizeCampaignJob;
