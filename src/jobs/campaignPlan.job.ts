import { ICampaign } from "../models/campaign.model";
import { plannerAgent } from "../services/agents/planner.agent";
import Campaign from "../models/campaign.model";

type Job<T = unknown> = {
  attrs: {
    data?: T;
    unique?: boolean;
    uniqueOpts?: Record<string, unknown>;
    disable?: boolean;
  };
};

interface CampaignPlanJobData {
  campaignId: string;
}

export function defineCampaignPlanJob(agenda:any): void {
  agenda.define(
    "generate-campaign-plan",
    { priority: "high", concurrency: 1 },
    async (job: Job<CampaignPlanJobData>) => {
      const data = job.attrs.data!;
      const campaignId = data?.campaignId;

      console.log(`[CampaignPlanJob] Starting plan generation for campaign: ${campaignId}`);
      console.log("Agenda: generate-campaign-plan")

      try {
        const campaign = (await Campaign.findById(campaignId).populate("products")) as ICampaign;

        if (!campaign) {
          throw new Error(`Campaign not found: ${campaignId}`);
        }

        if (campaign.status === "completed") {
          console.log(`[CampaignPlanJob] Campaign already completed: ${campaignId}`);
          return;
        }

        campaign.status = "planning";
        await campaign.save();

        const plan = await plannerAgent.createPlan(campaign);

        campaign.plan = plan.themes as any;
        campaign.expectedPostCount = plan.totalPosts;
        await campaign.save();

        console.log(`[CampaignPlanJob] Generated ${plan.themes.length} themes for ${plan.totalPosts} posts`);

        const batches = plannerAgent.splitIntoBatches(plan.themes, 5);

        for (let i = 0; i < batches.length; i++) {
          await agenda.schedule(
            "now",
            "generate-post-batch",
            {
              campaignId,
              themes: batches[i],
              batchIndex: i,
              totalBatches: batches.length,
            }
          );
          console.log(`[CampaignPlanJob] Enqueued batch ${i + 1}/${batches.length}`);
        }

        await agenda.schedule(
          "in 5 minutes",
          "finalize-campaign",
          { campaignId, expectedBatches: batches.length }
        );
      } catch (error) {
        console.error(`[CampaignPlanJob] Error:`, error);

        await Campaign.findByIdAndUpdate(campaignId, {
          status: "failed",
          errorMessage: (error as Error).message,
        });

        throw error;
      }
    }
  );
}

export default defineCampaignPlanJob;
