/* =========================================================
   SUB AGENT: CAMPAIGN STRATEGIST
========================================================= */

import { getSocialAnalytics } from "./analytics.tools";
import { getPreviousCampaigns } from "./campaign.tools";
import { getProducts } from "./products.tools";
import { getPlatformRules } from "./socialmedia.tools";
import { createPost, updatePostStage } from "./post.tools";

export const campaignStrategist = {
  name: "campaign_strategist",

  description:
    "Creates the overall marketing strategy for the campaign.",

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
    getProducts,
    getPreviousCampaigns,
    getSocialAnalytics,
    getPlatformRules,
    createPost,
    updatePostStage,
  ],
};