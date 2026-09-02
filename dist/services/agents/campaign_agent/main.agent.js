"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignAgent = exports.campaignInputSchema = void 0;
const deepagents_1 = require("deepagents");
const zod_1 = require("zod");
const groqModels_1 = require("../../../lib/groqModels");
const products_tools_1 = require("./products.tools");
const campaign_tools_1 = require("./campaign.tools");
const analytics_tools_1 = require("./analytics.tools");
const socialmedia_tools_1 = require("./socialmedia.tools");
const post_tools_1 = require("./post.tools");
// IMPORTING SUBAGENTS
const productAnalyst_subagent_1 = require("./productAnalyst.subagent");
const campaignStrategyst_subagent_1 = require("./campaignStrategyst.subagent");
const copywriter_subagent_1 = require("./copywriter.subagent");
const creativeDirector_subagent_1 = require("./creativeDirector.subagent");
const contentCritic_subagent_1 = require("./contentCritic.subagent");
/* =========================================================
   LLM
========================================================= */
/* =========================================================
   INPUT SCHEMA
========================================================= */
exports.campaignInputSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).describe("Campaign name used in the database."),
    instituteId: zod_1.z.string().min(1).optional().describe("Institute that owns the campaign."),
    userId: zod_1.z.string().min(1).optional().describe("Admin or user creating the campaign."),
    accountId: zod_1.z.string().min(1).optional().describe("Account linked to the campaign."),
    products: zod_1.z.array(zod_1.z.string()).min(1).describe("Products selected for the campaign."),
    goals: zod_1.z.string().min(3).describe("Primary campaign objective, such as increase sales or brand awareness."),
    description: zod_1.z.string().optional().describe("Optional campaign summary or notes."),
    startsFrom: zod_1.z.string().describe("Campaign start date in ISO format."),
    duration: zod_1.z.number().int().positive().describe("Campaign length in days."),
    postsPerDay: zod_1.z.number().int().positive().describe("How many posts per day to generate."),
    language: zod_1.z.string().optional().describe("Content language, for example en, es, or tr."),
    tone: zod_1.z.string().optional().describe("Brand tone, for example professional, playful, luxury."),
    postTypes: zod_1.z.array(zod_1.z.enum([
        "product_showcase",
        "educational",
        "promotional",
        "problem_solution",
        "social_proof",
        "styling",
        "behind_the_scenes",
    ])).min(1).optional().describe("Allowed content formats for the calendar."),
    platforms: zod_1.z.array(zod_1.z.enum([
        "facebook",
        "instagram",
        "tiktok",
        "twitter",
        "linkedin",
        "youtube",
    ])).min(1).describe("Platforms where the campaign will be published."),
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
    model: (0, groqModels_1.createGroqModel)(0.4),
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
        post_tools_1.createPost,
        post_tools_1.updatePostStage,
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
