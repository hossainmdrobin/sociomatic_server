import { createDeepAgent } from "deepagents";
import { z } from "zod";
import { ChatGroq } from "@langchain/groq";
import { getProducts } from "./products.tools";
import { getPreviousCampaigns } from "./campaign.tools";
import { getSocialAnalytics } from "./analytics.tools";
import { getPlatformRules } from "./socialmedia.tools";
import { createPost, updatePostStage } from "./post.tools";

// IMPORTING SUBAGENTS
import { productAnalyst } from "./productAnalyst.subagent";
import { campaignStrategist } from "./campaignStrategyst.subagent";
import { copywriter } from "./copywriter.subagent";
import { creativeDirector } from "./creativeDirector.subagent";
import { contentCritic } from "./contentCritic.subagent";

/* =========================================================
   LLM
========================================================= */

const model = new ChatGroq({
  model: process.env.GROQ_MODEL!,
  temperature: 0.4,
  apiKey: process.env.GROQ_API_KEY,
});

/* =========================================================
   INPUT SCHEMA
========================================================= */

export const campaignInputSchema = z.object({
  name: z.string().min(3).describe("Campaign name used in the database."),

  instituteId: z.string().min(1).optional().describe("Institute that owns the campaign."),

  userId: z.string().min(1).optional().describe("Admin or user creating the campaign."),

  accountId: z.string().min(1).optional().describe("Account linked to the campaign."),

  products: z.array(z.string()).min(1).describe("Products selected for the campaign."),

  goals: z.string().min(3).describe("Primary campaign objective, such as increase sales or brand awareness."),

  description: z.string().optional().describe("Optional campaign summary or notes."),

  startsFrom: z.string().describe("Campaign start date in ISO format."),

  duration: z.number().int().positive().describe("Campaign length in days."),

  postsPerDay: z.number().int().positive().describe("How many posts per day to generate."),

  language: z.string().optional().describe("Content language, for example en, es, or tr."),

  tone: z.string().optional().describe("Brand tone, for example professional, playful, luxury."),

  postTypes: z.array(
    z.enum([
      "product_showcase",
      "educational",
      "promotional",
      "problem_solution",
      "social_proof",
      "styling",
      "behind_the_scenes",
    ])
  ).min(1).optional().describe("Allowed content formats for the calendar."),

  platforms: z.array(
    z.enum([
      "facebook",
      "instagram",
      "tiktok",
      "twitter",
      "linkedin",
      "youtube",
    ])
  ).min(1).describe("Platforms where the campaign will be published."),
});


/* =========================================================
   SUB AGENT: CONTENT PLANNER
========================================================= */

const contentPlanner = {
  name: "content_planner",

  description:
    "Creates the campaign content calendar.",

  systemPrompt: `
You are a professional social media content planner.

Create a complete content calendar.

Requirements:

- Respect start date
- Respect campaign duration
- Respect posts per day
- Use only selected post types
- Balance content types
- Avoid repetitive posts
- Adapt content to each platform
- Spread products intelligently
- Include strategic promotional content

Return a structured list of planned posts.

Do NOT write final captions yet.
Only create the content plan.
`,

  tools: [
    getProducts,
    getPlatformRules,
  ],
};

/* =========================================================
   MAIN DEEP AGENT
========================================================= */

export const campaignAgent = createDeepAgent({
  model,

  systemPrompt: `
You are the Campaign Manager AI.

Your job is to orchestrate the complete social media
marketing campaign creation process.

WORKFLOW:

1. Understand campaign requirements.

2. Ask the Product Analyst to analyze products.

3. Ask the Campaign Strategist to create the strategy.

4. Ask the Content Planner to create the content calendar.

5. Ask the Copywriter to create copy.

6. Ask the Creative Director to create creative concepts.

7. Ask the Content Critic to review the content.

8. If content fails review, revise it.

9. Return the final campaign as structured data.

IMPORTANT RULES:

- Never invent product information.
- Never invent prices or discounts.
- Never publish without explicit approval.
- Never schedule unapproved content.
- Never skip validation.
- Keep the campaign aligned with the user's goal.

The final result should contain:

campaign
strategy
contentCalendar
posts
validation
`,
  
  tools: [
    getProducts,
    getPreviousCampaigns,
    getPlatformRules,
    getSocialAnalytics,
    createPost,
    updatePostStage,
  ],

  subagents: [
    productAnalyst,
    campaignStrategist,
    contentPlanner,
    copywriter,
    creativeDirector,
    contentCritic,
  ],
});