import { createDeepAgent } from "deepagents";
import { z } from "zod";
import { ChatGroq } from "@langchain/groq";
import { getProducts } from "./products.tools";
import { getPreviousCampaigns } from "./campaign.tools";
import { getSocialAnalytics } from "./analytics.tools";
import { getPlatformRules } from "./socialmedia.tools";

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
  productIds: z.array(z.string()).min(1),

  startDate: z.string(),

  durationDays: z.number().int().positive(),

  goal: z.enum([
    "sales",
    "awareness",
    "engagement",
    "traffic",
    "product_launch",
  ]),

  postsPerDay: z.number().int().positive(),

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
  ),

  platforms: z.array(
    z.enum([
      "facebook",
      "instagram",
      "tiktok",
    ])
  ),
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