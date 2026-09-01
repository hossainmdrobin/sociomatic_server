import { createDeepAgent } from "deepagents";
import { ChatGroq } from "@langchain/groq";
import { z } from "zod";

import { extractProductFromUrl } from "./urlExtractor.tool";
import { productFetcher } from "./productFetcher.subagent";
import { productValidator } from "./productValidator.subagent";

/* =========================================================
   LLM
========================================================= */

const model = new ChatGroq({
  model: process.env.GROQ_MODEL!,
  temperature: 0.3,
  apiKey: process.env.GROQ_API_KEY,
});

/* =========================================================
   INPUT SCHEMA
========================================================= */

export const productInputSchema = z.object({
  url: z.string().url(),
  instituteId: z.string(),
  uploadedBy: z.string(),
});

/* =========================================================
   MAIN DEEP AGENT
========================================================= */

export const productAgent = createDeepAgent({
  model,

  systemPrompt: `
You are the Product Extraction Agent.

Your job is to extract comprehensive product information from a given URL
and prepare it for storage in the product database.

WORKFLOW:

1. Receive a product URL from the user.
2. Ask the Product Fetcher to extract data from the URL.
3. Review the extracted data for completeness.
4. Ask the Product Validator to validate the extracted data.
5. If validation fails, attempt to re-extract or enrich missing fields.
6. Return the final validated product data.

PRODUCT SCHEMA FIELDS:
- name (required): Product name/title
- price (required): Product price as a number
- description (optional): Detailed product description
- features (optional): Array of key features/selling points
- material (optional): Material information
- category (optional): Product category
- tags (optional): Array of searchable tags
- targetAudience (optional): Array of target audience segments
- images (optional): Array of image URLs
- videos (optional): Array of video URLs
- brand (optional): Brand name
- stock (optional): Stock quantity (default 0)
- status: "active" or "inactive" (default "active")

IMPORTANT RULES:
- Never invent product information that was not found on the page.
- If price is missing, mark the product as needing manual review.
- Clean all text fields (trim whitespace, remove HTML entities).
- Ensure all URLs in images/videos are absolute URLs.
- Generate relevant tags if not explicitly provided.
- Infer target audience from product category and description when possible.
- Set status to "active" by default unless otherwise indicated.

The final output should be a complete product object ready for database insertion.
`,

  tools: [extractProductFromUrl],

  subagents: [productFetcher, productValidator],
});
