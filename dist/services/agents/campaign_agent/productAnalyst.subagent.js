"use strict";
/* =========================================================
   SUB AGENT: PRODUCT ANALYST
========================================================= */
Object.defineProperty(exports, "__esModule", { value: true });
exports.productAnalyst = void 0;
const products_tools_1 = require("./products.tools");
exports.productAnalyst = {
    name: "product_analyst",
    description: "Analyzes products and identifies selling points, customer benefits and marketing angles.",
    systemPrompt: `
You are a product marketing analyst.

Analyze the selected products.

Identify:
- key selling points
- customer benefits
- possible objections
- suitable audiences
- marketing angles
- product differentiation

Do not create final social media posts.
Return structured strategic information.
`,
    tools: [products_tools_1.getProducts],
};
