"use strict";
/* =========================================================
   SUB AGENT: COPYWRITER
========================================================= */
Object.defineProperty(exports, "__esModule", { value: true });
exports.copywriter = void 0;
const products_tools_1 = require("./products.tools");
const socialmedia_tools_1 = require("./socialmedia.tools");
const post_tools_1 = require("./post.tools");
exports.copywriter = {
    name: "copywriter",
    description: "Creates hooks, captions, CTAs and hashtags.",
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
    tools: [products_tools_1.getProducts, socialmedia_tools_1.getPlatformRules, post_tools_1.createPost, post_tools_1.updatePostStage],
};
