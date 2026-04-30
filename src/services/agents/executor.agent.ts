import llmService from "../../lib/llm";
import validatorAgent from "./validator.agent";
import { Theme } from "./planner.agent";
import { ICampaign } from "../../models/campaign.model";
import { Post } from "../../models/post.model";

export interface GeneratedPost {
  text: string;
  images: string[];
  videos: string[];
  platform: string;
  budget: number;
  scheduledAt: string;
  tags: string[];
}

export class ExecutorAgent {
  async execute(campaign: ICampaign, theme: Theme): Promise<GeneratedPost[]> {

    const posts = await this.generatePostsForTheme(campaign, theme);
    return posts;
  }

  private async generatePostsForTheme(
    campaign: ICampaign,
    theme: Theme
  ): Promise<GeneratedPost[]> {
    const prompt = this.buildPrompt(campaign, theme);
    const rawOutput = await llmService.completeWithRetry(prompt);

    const result = await validatorAgent.validate<GeneratedPost[]>(
      rawOutput,
      {
        type: "array",
        items: {
          type: "object",
          required: ["text", "platform", "budget", "scheduledAt", "tags"],
          properties: {
            text: { type: "string" },
            images: { type: "array", items: { type: "string" } },
            videos: { type: "array", items: { type: "string" } },
            platform: { type: "string" },
            budget: { type: "number" },
            scheduledAt: { type: "string", format: "date-time" },
            tags: { type: "array", items: { type: "string" } },
          },
        },
      }
    );

    if (!result.success || !result.data) {
      console.error(`Failed to generate posts for theme ${theme.theme}: ${result.error}`);
      return [];
    }

    return result.data;
  }

  private buildPrompt(campaign: ICampaign, theme: Theme): string {
    const { name, goals, tone, platforms, postsPerDay, startsFrom } = campaign;
    const platformList = (platforms || []).join(", ") || "facebook, instagram, linkedin, twitter";
    const postCount = postsPerDay || 5;

    const baseDate = new Date(startsFrom || Date.now());
    const year = baseDate.getFullYear();
    const month = String(baseDate.getMonth() + 1).padStart(2, "0");
    const day = String(baseDate.getDate() + (theme.day - 1)).padStart(2, "0");

    const timeSlots = [
      "09:00:00.000Z",
      "11:00:00.000Z",
      "13:00:00.000Z",
      "15:00:00.000Z",
      "17:00:00.000Z",
    ];

    const scheduledTimes = timeSlots.slice(0, postCount).map((time) =>
      `${year}-${month}-${day}T${time}`
    );

    return `You are a social media content creator. Generate ${postCount} posts for a campaign.

Campaign:
- Name: ${name}
- Goal: ${goals}
- Tone: ${tone || "professional and friendly"}
- Platforms: ${platformList}
- Language: ${campaign.language || "English"}

Current Theme (Day ${theme.day}):
${theme.theme}
${theme.focusArea ? `Focus Area: ${theme.focusArea}` : ""}

Generate exactly ${postCount} diverse posts. Each post must have a unique scheduledAt timestamp.

Return ONLY a valid JSON array. No markdown, no explanations, no code blocks. Use this exact structure:
[
  {
    "text": "Post body text",
    "images": [],
    "videos": [],
    "platform": "facebook|instagram|linkedin|twitter",
    "budget": 0,
    "scheduledAt": "ISO8601_TIMESTAMP",
    "tags": ["tag1", "tag2"]
  }
]

Constraints:
- text: max 500 characters, engaging and platform-appropriate
- images: array of image URLs, empty if none
- videos: array of video URLs, empty if none
- platform: one of [facebook, instagram, twitter, linkedin]
- budget: numeric value in USD (0 if not applicable)
- scheduledAt: must be one of these exact ISO8601 timestamps: ${scheduledTimes.map((t, i) => `${i + 1}. ${t}`).join(", ")}
- tags: 3-5 relevant hashtags without the # symbol

Ensure scheduledAt matches the provided timestamps exactly, one per post.`;
  }

  async savePosts(posts: GeneratedPost[], campaignId: string, adminId: string, instituteId: string, accountId: string): Promise<number> {
    if (posts.length === 0) return 0;

    const postDocuments = posts.map((post) => ({
      campaign: campaignId,
      admin: adminId,
      institute: instituteId,
      creator: adminId,
      account: accountId,
      text: post.text,
      caption: "", // caption not in output schema, set empty or derive from text
      tags: post.tags,
      platform: post.platform,
      stage: "draft",
      budget: post.budget,
      scheduledAt: new Date(post.scheduledAt),
      images: post.images || [],
      videos: post.videos || [],
    }));

    await Post.insertMany(postDocuments);
    return postDocuments.length;
  }
}

export const executorAgent = new ExecutorAgent();
export default executorAgent;
