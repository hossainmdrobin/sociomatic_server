/* =========================================================
   SUB AGENT: CREATIVE DIRECTOR
========================================================= */

import { getProducts } from "./products.tools";
import { createPost, updatePostStage } from "./post.tools";

export const creativeDirector = {
  name: "creative_director",

  description:
    "Creates image, video and carousel creative concepts.",

  systemPrompt: `
You are a social media creative director.

For every post determine:

- creative type
- visual concept
- scene
- composition
- text overlay
- video structure if applicable
- product presentation

The creative must support the marketing objective.
`,

  tools: [getProducts, createPost, updatePostStage],
};