import llmService from "../../lib/llm";
import validatorAgent from "./validator.agent";
import { ICampaign } from "../../models/campaign.model";
import { generateSingleDayPlanPrompt } from "../../prompts/campaignPlanPrompt";

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

  async createPlan(campaign: ICampaign, day: number): Promise<CampaignPlan> {
    const prompt = this.buildPrompt(campaign,day);
    const rawOutput = await llmService.completeWithRetry(prompt); // Plan generator line
    const result = await validatorAgent.validate<Theme[]>(
      rawOutput,
      { type: "array", items: { type: "object", properties: { day: {}, theme: {} } } }
    );

    if (!result.success || !result.data) {
      throw new Error(`Failed to generate plan: ${result.error}`);
    }
    console.log(result);

    const data = result.data as any;
    const themeArray = data.contentPlan || data.content_plan || data.themes || data || [];
    const themes = themeArray.map((t: any, index: number) => ({
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

  private buildPrompt(campaign: ICampaign, day: number): string {
    return generateSingleDayPlanPrompt(campaign, day);
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
