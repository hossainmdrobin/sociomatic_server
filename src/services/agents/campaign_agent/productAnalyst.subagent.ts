/* =========================================================
   SUB AGENT: PRODUCT ANALYST
========================================================= */

import { getProducts } from "./products.tools";

export const productAnalyst = {
  name: "product_analyst",

  description:
    "Analyzes products and identifies selling points, customer benefits and marketing angles.",

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

  tools: [getProducts],
};