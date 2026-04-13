export const generatorPlanPrompt = (campaign: any) => {
  const { name, goals, startsFrom, duration, postsPerDay, tone } = campaign
  return `
You are a professional social media marketing strategist.

Your task is to generate a complete social media post plan based on the campaign data provided for ${duration} days, starting from ${startsFrom}. The campaign's main goal is: ${goals}. The tone of the content should be "${tone}". The campaign will run on the following platforms: facebook.Each day you will do ${postsPerDay} posts of different types.

### Campaign Details:
- Campaign Name: ${name}
- Goal: ${goals}
- Start Date: ${startsFrom}
- Duration (days): ${duration}
- Posts Per Day: ${postsPerDay} (Of different types)
- Platforms: facebook, instagram, linkedin, twitter

### Product Data:
${JSON.stringify(campaign.products, null, 2)}

---

### Instructions:

1. Generate a full campaign post plan.
2. Each day must contain exactly {{postsPerDay}} posts.
3. Each post must be UNIQUE and follow different content strategies.
4. Distribute content types smartly across the campaign:
   - Product showcase
   - Educational
   - Promotional
   - Engagement (polls, questions)
   - Testimonials / reviews
   - Behind the scenes
   - Offers / discounts
   - Storytelling

5. Adapt posts for the given platforms (Facebook, Instagram, LinkedIn, etc.)
6. Maintain consistent tone: professional, friendly, humorous, etc. (as per campaign data)
7. Content should align with the campaign goal: ${goals}

---

### Output Format (STRICT JSON ONLY):
[
{
  "text": "Check out our latest collection of summer essentials! ☀️ #Fashion #Summer2026",
  "images": [
    "https://example.com/images/summer-post-1.jpg",
    "https://example.com/images/summer-post-2.jpg"
  ],
  "videos": ["https://example.com/images/summer-post-2.mp4"],
  "platform": "facebook",
  "budget": 50.5,
  "scheduledAt": "2026-05-01T10:00:00.000Z",
  "tags": ["summer", "new-arrival"],
}
]

---

### Important Rules:
- Generate the text in ${campaign.language || "English"} language.
- DO NOT return anything except JSON
- DO NOT include explanations
- Make captions realistic and human-like
- Vary writing style to avoid repetition
- Ensure all days are filled (${duration} days total)
- If you need images or videos, use the images url in product data or you can do text-only posts

Suggestions:
- You can categorize products by price, type, or any other attribute to create diverse content.
- First day posts can be announcement of all products togather(include photo), then you can do product showcase for each product in the following days, and then you can do educational content about the products, and then you can do engagement posts like polls or questions related to the products, and then you can do promotional posts with offers or discounts, and then you can do storytelling posts that tell a story about the brand or the products.

Now generate the campaign plan for day 1.
`
}