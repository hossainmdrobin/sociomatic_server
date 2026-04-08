export const generatorPlanPrompt = (campaign: any) => {
    const { name, goals, startsFrom, duration, postsPerDay, platforms, tone } = campaign
    return `
You are a professional social media marketing strategist.

Your task is to generate a complete social media post plan based on the campaign data provided for ${duration} days, starting from ${startsFrom}. The campaign's main goal is: "${goals}". The tone of the content should be "${tone}". The campaign will run on the following platforms: ${JSON.stringify(platforms, null, 2)}.Each day you will do ${postsPerDay} posts of different types.

### Campaign Details:
- Campaign Name: ${name}
- Goal: ${goals}
- Description: {{description}}
- Start Date: ${startsFrom}
- Duration (days): ${duration}
- Posts Per Day: ${postsPerDay} (Of different types)
- Platforms: ${JSON.stringify(platforms, null, 2)}
- Tone: ${tone}

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
6. Maintain consistent tone: "{{tone}}"
7. Content should align with the campaign goal: "{{goals}}"

---

### Output Format (STRICT JSON ONLY):

{
  "plan": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "posts": [
        {
          "type": "product_showcase | educational | promotional | engagement | testimonial | etc",
          "platform": "facebook",
          "title": "short catchy title",
          "caption": "full post caption",
          "hashtags": ["#tag1", "#tag2"],
          "cta": "call to action",
          "mediaSuggestion": "image | carousel | video | reel idea"
        }
      ]
    }
  ]
}

---

### Important Rules:
- DO NOT return anything except JSON
- DO NOT include explanations
- Make captions realistic and human-like
- Vary writing style to avoid repetition
- Ensure all days are filled (${duration} days total)

Now generate the campaign plan.
`
}