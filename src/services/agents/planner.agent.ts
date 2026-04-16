import llmService from "../../lib/llm";
import validatorAgent from "./validator.agent";
import { ICampaign } from "../../models/campaign.model";

export interface Theme {
  day: number;
  theme: string;
  focusArea?: string;
}

export interface CampaignPlan {
  campaignId: string;
  themes: Theme[];
  totalPosts: number;
}

const POSTS_PER_DAY = 5;

export class PlannerAgent {
  private postsPerDay: number;

  constructor(postsPerDay: number = POSTS_PER_DAY) {
    this.postsPerDay = postsPerDay;
  }

  async createPlan(campaign: ICampaign): Promise<CampaignPlan> {
    const prompt = this.buildPrompt(campaign);
    const rawOutput = await llmService.completeWithRetry(prompt);

    const result = await validatorAgent.validate<Theme[]>(
      rawOutput,
      { type: "array", items: { type: "object", properties: { day: {}, theme: {} } } }
    );

    if (!result.success || !result.data) {
      throw new Error(`Failed to generate plan: ${result.error}`);
    }

    const themes = result.data.map((t, index) => ({
      day: t.day || index + 1,
      theme: t.theme,
      focusArea: t.focusArea,
    }));

    return {
      campaignId: campaign._id.toString(),
      themes,
      totalPosts: themes.length * this.postsPerDay,
    };
  }

  private buildPrompt(campaign: ICampaign): string {
    const { name, goals, description, duration, postsPerDay, platforms, tone } = campaign;
    const productList =
      campaign.products && campaign.products.length > 0
        ? campaign.products.map((p: any) => `- ${p.name}: ${p.description || "No description"}`).join("\n")
        : "No specific products";

    return `You are a professional social media marketing strategist. Create a content plan for a marketing campaign.

Campaign Details:
- Name: ${name}
- Description: ${description || goals}
- Goal: ${goals}
- Target Tone: ${tone || "professional and friendly"}
- Platforms: ${(platforms || []).join(", ") || "facebook, instagram, linkedin, twitter"}
- Duration: ${duration} days
- Posts Per Day: ${postsPerDay || 5}

Products/Services:
${productList}

Generate a content plan with themes for each day. Each theme should be engaging and varied. The themes should cover:
- Product showcases
- Educational content
- Promotional posts
- Engagement posts (polls, questions)
- Testimonials/reviews
- Behind the scenes
- Offers/discounts
- Storytelling

Return ONLY a valid JSON array with this exact structure:
[{"day": 1, "theme": "theme description"}, {"day": 2, "theme": "theme description"}]

Generate themes for at least ${duration} days to create ${duration * (postsPerDay || 5)}+ posts. Make themes diverse and strategic.`;
  }

  splitIntoBatches(themes: Theme[], batchSize: number = 5): Theme[][] {
    const batches: Theme[][] = [];
    for (let i = 0; i < themes.length; i += batchSize) {
      batches.push(themes.slice(i, i + batchSize));
    }
    return batches;
  }
}

export const plannerAgent = new PlannerAgent();
export default plannerAgent;
