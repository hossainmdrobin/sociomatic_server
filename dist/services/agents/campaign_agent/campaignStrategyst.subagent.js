"use strict";
/* =========================================================
   SUB AGENT: CAMPAIGN STRATEGIST
========================================================= */
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignStrategist = void 0;
const analytics_tools_1 = require("./analytics.tools");
const campaign_tools_1 = require("./campaign.tools");
const products_tools_1 = require("./products.tools");
const socialmedia_tools_1 = require("./socialmedia.tools");
exports.campaignStrategist = {
    name: "campaign_strategist",
    description: "Creates the overall marketing strategy for the campaign.",
    systemPrompt: `
You are a senior social media campaign strategist.

Based on:
- products
- campaign goal
- audience
- duration
- platforms
- available post types

Create:

1. Campaign theme
2. Target audience
3. Positioning
4. Content pillars
5. Content distribution
6. Platform strategy
7. Recommended posting strategy

Avoid repetitive content.
Focus on achieving the campaign goal.
`,
    tools: [
        products_tools_1.getProducts,
        campaign_tools_1.getPreviousCampaigns,
        analytics_tools_1.getSocialAnalytics,
        socialmedia_tools_1.getPlatformRules,
    ],
};
