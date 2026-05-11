import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { IPlanDay } from "../../src/models/campaignplan.model";
import { CampaignGraphState } from "./types";

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0.7,
});

export async function plannerNode(
  state: CampaignGraphState
): Promise<Partial<CampaignGraphState>> {
  const { context, goals, description, tone, language, platforms, postsPerDay, duration, startsFrom, name } = state;

  const systemPrompt = `You are a social media campaign planner. 
Your job is to create a structured day-by-day campaign plan.
You MUST respond with ONLY valid JSON — no explanation, no markdown, no backticks.
The JSON must match this exact shape:
{
  "plan": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "posts": [
        {
          "type": "product_showcase" | "educational" | "promotional" | "engagement" | "testimonial" | "other",
          "platform": "facebook" | "instagram" | "twitter" | "linkedin",
          "title": "string",
          "caption": "string (full post caption, ready to publish)",
          "hashtags": ["string"],
          "cta": "string (optional)",
          "mediaSuggestion": "image" | "carousel" | "video" | "reel" (optional)
        }
      ]
    }
  ]
}`;

  const productList = context!.products
    .map((p) => `- ${p.name}${p.description ? `: ${p.description}` : ""}`)
    .join("\n");

  const startDate = new Date(startsFrom);

  const userPrompt = `Create a ${duration}-day social media campaign plan.

Campaign name: ${name}
Goals: ${goals}
${description ? `Description: ${description}` : ""}
Tone: ${tone ?? "professional and engaging"}
Language: ${language ?? "English"}
Platforms: ${platforms.join(", ")}
Posts per day: ${postsPerDay}
Start date: ${startDate.toISOString().split("T")[0]}

Products available:
${productList}

Institute: ${context!.instituteName}
${context!.instituteDescription ? `About: ${context!.instituteDescription}` : ""}

Rules:
- Generate exactly ${postsPerDay} posts per day for ${duration} days (total: ${postsPerDay * duration} posts)
- Distribute post types naturally (don't repeat the same type consecutively)
- Rotate platforms across the day if multiple platforms are provided
- Captions must be complete, ready-to-publish content
- Dates start from ${startDate.toISOString().split("T")[0]} and increment by 1 day`;

  const response = await llm.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(userPrompt),
  ]);

  const raw = response.content as string;

  let parsed: { plan: IPlanDay[] };
  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Planner returned invalid JSON: ${raw.slice(0, 200)}`);
  }

  if (!parsed.plan || !Array.isArray(parsed.plan)) {
    throw new Error("Planner response missing 'plan' array");
  }

  return {
    plan: parsed.plan,
  };
}