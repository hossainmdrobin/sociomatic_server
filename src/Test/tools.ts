import mongoose from "mongoose";
import Campaign from "../../src/models/campaign.model";
import { CampaignGraphState, CampaignContext } from "./types";

export async function fetchCampaignContext(
  state: CampaignGraphState
): Promise<CampaignContext> {
  const campaign = await Campaign.findById(state.campaignId)
    .populate("products", "name description price")
    .populate("institute", "name description")
    .lean();

  if (!campaign) throw new Error(`Campaign ${state.campaignId} not found`);

  const institute = campaign.institute as any;

  return {
    products: (campaign.products as any[]).map((p) => ({
      _id: p._id.toString(),
      name: p.name,
      description: p.description,
      price: p.price,
    })),
    instituteName: institute?.name ?? "Unknown",
    instituteDescription: institute?.description,
  };
}

export function computeScheduledAt(
  startsFrom: Date,
  dayIndex: number,       // 0-based
  postIndex: number,      // 0-based within the day
  postsPerDay: number
): Date {
  const date = new Date(startsFrom);
  date.setDate(date.getDate() + dayIndex);

  // Spread posts: 9am, 12pm, 3pm, 6pm (then repeat if postsPerDay > 4)
  const baseHours = [9, 12, 15, 18, 20];
  const hour = baseHours[postIndex % baseHours.length];
  date.setHours(hour, 0, 0, 0);

  return date;
}