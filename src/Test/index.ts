import mongoose from "mongoose";
import Campaign from "../../src/models/campaign.model";
import { buildCampaignGraph } from "./graph";
import { CampaignGraphState } from "./types";

export async function runCampaignGeneration(campaignId: string): Promise<void> {
  const campaign = await Campaign.findById(campaignId).lean();
  if (!campaign) throw new Error(`Campaign ${campaignId} not found`);

  await Campaign.findByIdAndUpdate(campaignId, { status: "planning" });

  const initialState: CampaignGraphState = {
    campaignId: campaign._id.toString(),
    userId: campaign.user.toString(),
    instituteId: campaign.institute.toString(),
    accountId: campaign.account.toString(),

    name: campaign.name,
    goals: campaign.goals,
    description: campaign.description,
    tone: campaign.tone,
    language: campaign.language,
    platforms: campaign.platforms,
    postsPerDay: campaign.postsPerDay,
    duration: campaign.duration,
    startsFrom: campaign.startsFrom,

    context: null,
    plan: [],
    currentDayIndex: 0,
    currentPostIndex: 0,
    generatedCount: 0,
  };

  const graph = buildCampaignGraph();

  try {
    await graph.invoke(initialState);
    console.log(`Campaign ${campaignId} generation complete`);
  } catch (err: any) {
    console.error(`Campaign ${campaignId} failed:`, err.message);
    await Campaign.findByIdAndUpdate(campaignId, {
      status: "failed",
      errorMessage: err.message,
    });
  }
}