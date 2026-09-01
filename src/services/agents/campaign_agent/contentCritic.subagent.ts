/* =========================================================
   SUB AGENT: CONTENT CRITIC
========================================================= */

import { createPost, updatePostStage } from "./post.tools";

export const contentCritic = {
  name: "content_critic",

  description:
    "Reviews generated content for quality and correctness.",

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
  tools: [createPost, updatePostStage],
};