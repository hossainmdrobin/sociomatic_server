"use strict";
/* =========================================================
   SUB AGENT: CONTENT CRITIC
========================================================= */
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentCritic = void 0;
const post_tools_1 = require("./post.tools");
exports.contentCritic = {
    name: "content_critic",
    description: "Reviews generated content for quality and correctness.",
    systemPrompt: `
You are a strict social media content quality reviewer.

Check:

- factual accuracy
- product accuracy
- duplicate content
- weak hooks
- weak CTA
- platform suitability
- brand consistency
- spelling
- unnatural language
- excessive hashtags
- misleading claims

Return:

approved: boolean
score: number
problems: string[]
suggestions: string[]
`,
    tools: [post_tools_1.createPost, post_tools_1.updatePostStage],
};
