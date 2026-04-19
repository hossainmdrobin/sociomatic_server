import llmService from "../../lib/llm";
import validatorAgent from "./validator.agent";
import { Theme } from "./planner.agent";
import { ICampaign } from "../../models/campaign.model";
import { Post } from "../../models/post.model";

export interface GeneratedPost {
  day: number;
  theme: string;
  text: string;
  caption: string;
  tags: string[];
  platform: string;
  postType: string;
  images?: string[];
  videos?: string[];
}

const POSTS_PER_THEME = 5;

export class ExecutorAgent {
  private postsPerTheme: number;

  constructor(postsPerTheme: number = POSTS_PER_THEME) {
    this.postsPerTheme = postsPerTheme;
  }

  async execute(campaign: ICampaign, themes: Theme[]): Promise<GeneratedPost[]> {
    const allPosts: GeneratedPost[] = [];

    for (const theme of themes) {
      const posts = await this.generatePostsForTheme(campaign, theme);
      allPosts.push(...posts);
    }

    return allPosts;
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
          properties: {
            day: { type: "number" },
            theme: { type: "string" },
            text: { type: "string" },
            caption: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
            platform: { type: "string" },
            postType: { type: "string" },
            images: { type: "array", items: { type: "string" } },
            videos: { type: "array", items: { type: "string" } },
          },
        },
      }
    );

    if (!result.success || !result.data) {
      console.error(`Failed to generate posts for theme ${theme.theme}: ${result.error}`);
      return [];
    }
    console.log("[Executor] the result is:", result.data);
    const data = result.data as any;
    const postArray = data.posts || []
    return postArray.map((post: any) => ({
      ...post,
      day: post.day || theme.day,
      theme: post.theme || theme.theme,
    }));
  }

  private buildPrompt(campaign: ICampaign, theme: Theme): string {
    const { name, goals, tone, platforms } = campaign;
    const platformList = (platforms || []).join(", ") || "facebook, instagram, linkedin, twitter";

    return `You are a social media content creator. Generate ${this.postsPerTheme} posts for a campaign.

Campaign:
- Name: ${name}
- Goal: ${goals}
- Tone: ${tone || "professional and friendly"}
- Platforms: ${platformList}
- Language: ${campaign.language || "English"}

Current Theme (Day ${theme.day}):
${theme.theme}

Generate ${this.postsPerTheme} diverse posts across different platforms. Mix content types: educational, promotional, engagement, behind_the_scenes, product_showcase, testimonial, etc.

Return ONLY a valid JSON array with this exact structure:
[{
  "day": ${theme.day},
  "theme": "${theme.theme.replace(/"/g, '\\"')}",
  "text": "post body text",
  "caption": "caption text",
  "tags": ["tag1", "tag2"],
  "platform": "facebook|instagram|linkedin|twitter",
  "postType": "text|product_showcase|educational|promotional|engagement|testimonial|behind_the_scenes",
  "images": [],
  "videos": []
}]

Make content engaging, platform-specific, and varied. Ensure tags are relevant.`;
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
      caption: post.caption,
      tags: post.tags,
      platform: post.platform,
      stage: "draft",
      postType: post.postType,
      images: post.images || [],
      videos: post.videos || [],
    }));

    await Post.insertMany(postDocuments);
    return postDocuments.length;
  }
}

export const executorAgent = new ExecutorAgent();
export default executorAgent;
