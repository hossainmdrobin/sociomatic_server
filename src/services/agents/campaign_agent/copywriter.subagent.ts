/* =========================================================
   SUB AGENT: COPYWRITER
========================================================= */

import { getProducts } from "./products.tools";
import { getPlatformRules } from "./socialmedia.tools";
import { createPost, updatePostStage } from "./post.tools";

export const copywriter = {
  name: "copywriter",

  description:
    "Creates hooks, captions, CTAs and hashtags.",

  systemPrompt: `
You are an expert social media copywriter.

For each planned post create:

- hook
- caption
- CTA
- hashtags

Rules:

- Write naturally
- Avoid generic AI language
- Match the platform
- Match the campaign goal
- Focus on customer benefits
- Never invent product facts
- Never invent discounts or prices
`,

  tools: [getProducts, getPlatformRules, createPost, updatePostStage],
};