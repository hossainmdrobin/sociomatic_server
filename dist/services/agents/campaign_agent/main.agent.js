"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignAgent = exports.campaignInputSchema = void 0;
const deepagents_1 = require("deepagents");
const zod_1 = require("zod");
const groq_1 = require("@langchain/groq");
const products_tools_1 = require("./products.tools");
const campaign_tools_1 = require("./campaign.tools");
const analytics_tools_1 = require("./analytics.tools");
const socialmedia_tools_1 = require("./socialmedia.tools");
// IMPORTING SUBAGENTS
const productAnalyst_subagent_1 = require("./productAnalyst.subagent");
const campaignStrategyst_subagent_1 = require("./campaignStrategyst.subagent");
const copywriter_subagent_1 = require("./copywriter.subagent");
const creativeDirector_subagent_1 = require("./creativeDirector.subagent");
const contentCritic_subagent_1 = require("./contentCritic.subagent");
/* =========================================================
   LLM
========================================================= */
const model = new groq_1.ChatGroq({
    model: process.env.GROQ_MODEL,
    temperature: 0.4,
    apiKey: process.env.GROQ_API_KEY,
});
/* =========================================================
   INPUT SCHEMA
========================================================= */
exports.campaignInputSchema = zod_1.z.object({
    productIds: zod_1.z.array(zod_1.z.string()).min(1),
    startDate: zod_1.z.string(),
    durationDays: zod_1.z.number().int().positive(),
    goal: zod_1.z.enum([
        "sales",
        "awareness",
        "engagement",
        "traffic",
        "product_launch",
    ]),
    postsPerDay: zod_1.z.number().int().positive(),
    postTypes: zod_1.z.array(zod_1.z.enum([
        "product_showcase",
        "educational",
        "promotional",
        "problem_solution",
        "social_proof",
        "styling",
        "behind_the_scenes",
    ])),
    platforms: zod_1.z.array(zod_1.z.enum([
        "facebook",
        "instagram",
        "tiktok",
    ])),
});
/* =========================================================
   SUB AGENT: CONTENT PLANNER
========================================================= */
const contentPlanner = {
    name: "content_planner",
    description: "Creates the campaign content calendar.",
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
        products_tools_1.getProducts,
        socialmedia_tools_1.getPlatformRules,
    ],
};
/* =========================================================
   MAIN DEEP AGENT
========================================================= */
exports.campaignAgent = (0, deepagents_1.createDeepAgent)({
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
        products_tools_1.getProducts,
        campaign_tools_1.getPreviousCampaigns,
        socialmedia_tools_1.getPlatformRules,
        analytics_tools_1.getSocialAnalytics,
    ],
    subagents: [
        productAnalyst_subagent_1.productAnalyst,
        campaignStrategyst_subagent_1.campaignStrategist,
        contentPlanner,
        copywriter_subagent_1.copywriter,
        creativeDirector_subagent_1.creativeDirector,
        contentCritic_subagent_1.contentCritic,
    ],
});
