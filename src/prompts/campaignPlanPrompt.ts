import { ICampaign } from "models/campaign.model";

export function generateSingleDayPlanPrompt(
    campaign: ICampaign,
    day: number,
): string {
    const { name, goals, description, duration, postsPerDay, platforms, tone } = campaign;

    const productList =
        campaign.products && campaign.products.length > 0
            ? campaign.products
                .map((p: any) => `- ${p._id}: ${p.name} (${p.description || "No description"})`)
                .join("\n")
            : "No specific products";

    return `You are a professional social media marketing strategist.

Your task is to generate a content plan for ONLY ONE DAY of an ongoing campaign.

---------------------
Campaign Details:
- Campaign ID: ${campaign._id}
- Name: ${name}
- Description: ${description || goals}
- Goal: ${goals}
- Tone: ${tone || "professional and friendly"}
- Platforms: ${(platforms || []).join(", ") || "facebook, instagram, linkedin, twitter"}
- Total Duration: ${duration} days
- Posts Per Day: ${postsPerDay || 5}

---------------------
Current Context:
- Generating Plan for Day: ${day}

Previous Plan Summary (important for continuity):
${campaign?.summary || "No previous summary (this is the first day or summary not available)."}

---------------------
Products/Services (use ONLY their IDs in output):
${productList}

---------------------
Instructions:

- Generate a strategic plan ONLY for Day ${day}
- Maintain logical flow with previous days (avoid repetition, progress storytelling)
- Vary content types across:
  • Product showcase
  • Educational
  • Promotional
  • Engagement (polls/questions)
  • Storytelling

//   • Testimonials/reviews
//   • Behind-the-scenes
//   • Offers/discounts

- Select relevant products for this day (can be multiple)
- Plan should feel like part of a bigger campaign journey

---------------------
Output Rules (VERY IMPORTANT):

Return ONLY a valid JSON object. No explanation. No extra text.

Structure MUST match exactly:

{
  "day": ${day},
  "planDescription": "Detailed description of the day's content strategy, explaining theme progression and post ideas",
  "products": ["mongoose_object_id"],
  "numberOfPost": ${postsPerDay || 5}
}

---------------------
Notes:
- "products" must be an array of product IDs from the list above
- "accounts" can be empty [] (will be filled later)
- "planDescription" should summarize the full day's strategy (not individual posts)
- Ensure the plan is unique compared to previous summary

Generate now.`;
}