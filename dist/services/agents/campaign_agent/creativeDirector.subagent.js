"use strict";
/* =========================================================
   SUB AGENT: CREATIVE DIRECTOR
========================================================= */
Object.defineProperty(exports, "__esModule", { value: true });
exports.creativeDirector = void 0;
const products_tools_1 = require("./products.tools");
const post_tools_1 = require("./post.tools");
exports.creativeDirector = {
    name: "creative_director",
    description: "Creates image, video and carousel creative concepts.",
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
    tools: [products_tools_1.getProducts, post_tools_1.createPost, post_tools_1.updatePostStage],
};
