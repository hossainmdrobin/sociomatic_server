import llmService from "../../lib/llm";
import validatorAgent from "./validator.agent";
import { ICampaign } from "../../models/campaign.model";
import { generateSingleDayPlanPrompt, updateCampaignSummaryPrompt } from "../../prompts/campaignPlanPrompt";
import campaignPlan from "../../models/campaignPlan";

export interface Theme {
  day: number;
  theme: string;
  focusArea?: string;
}

export interface CampaignPlan {
  summary: string;
  planId:string;
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
     // Validate raw LLM output against expected schema: a single object with day, planDescription,
     // products and numberOfPost fields. The validator handles JSON parsing, cleaning, and LLM-based
     // repair for malformed output, ensuring we get a usable result or a clear failure.
     const result = await validatorAgent.validate<{
       day: number;
       planDescription: string;
       products: string[];
       numberOfPost: number;
     }>(
       rawOutput,
       {
         type: "object",
         required: ["day", "planDescription", "products", "numberOfPost"],
         properties: {
           day: { type: "number" },
           planDescription: { type: "string" },
           products: { type: "array", items: { type: "string" } },
           numberOfPost: { type: "number" },
         },
       }
     );

     const newCampaignPlan = new campaignPlan({...result?.data, campaign: campaign._id, accounts: campaign.account})
     await newCampaignPlan.save();

     const summaryPrompt = updateCampaignSummaryPrompt(day, campaign.summary, result.data!);
     const summaryOutput = await llmService.completeWithRetry(summaryPrompt);
     const summaryResult = await validatorAgent.validate<{ updatedSummary: string }>(
       summaryOutput,
       {
         type: "object",
         required: ["updatedSummary"],
         properties: {
           updatedSummary: { type: "string" },
         },
       }
     );

     if (!result.success || !result.data) {
       throw new Error(`Failed to generate plan for day ${day}: ${result.error}`);
     }

     // Build themes array from the validated plan. Each generated plan describes one day,
     // so we derive a single theme entry from it. Use the day from the validated data
     // (ensuring it matches the requested day) and the planDescription as the theme text.
    //  const data = result.data;

    return {
      summary: summaryResult.data?.updatedSummary || campaign.summary || "",
      planId: newCampaignPlan._id.toString(),
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
