import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Post } from "../../src/models/post.model";
import { CampaignGraphState } from "./types";
import { computeScheduledAt } from "./tools";

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0.8,
});

export async function postGeneratorNode(
  state: CampaignGraphState
): Promise<Partial<CampaignGraphState>> {
  const {
    campaignId, userId, instituteId, accountId,
    plan, currentDayIndex, currentPostIndex,
    context, tone, language, postsPerDay, startsFrom, generatedCount,
  } = state;

  const day = plan[currentDayIndex];
  const planPost = day.posts[currentPostIndex];

  const systemPrompt = `You are a social media copywriter. 
Write polished, platform-native post content.
Respond ONLY with valid JSON, no markdown or explanation.
Shape: { "text": "full post text ready to publish" }`;

  const productContext = context!.products
    .map((p) => `- ${p.name}${p.description ? `: ${p.description}` : ""}`)
    .join("\n");

  const userPrompt = `Write the final post text for this campaign post.

Post details:
- Type: ${planPost.type}
- Platform: ${planPost.platform}
- Title/theme: ${planPost.title}
- Planned caption: ${planPost.caption}
- Hashtags: ${planPost.hashtags.join(" ")}
- CTA: ${planPost.cta ?? "none"}
- Tone: ${tone ?? "professional and engaging"}
- Language: ${language ?? "English"}

Products:
${productContext}

Refine the planned caption into the final post. 
Make it feel natural for ${planPost.platform}.
Include hashtags at the end.
${planPost.cta ? `End with a clear CTA: ${planPost.cta}` : ""}`;

  const response = await llm.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(userPrompt),
  ]);

  const raw = response.content as string;
  let parsed: { text: string };

  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch {
    // Fallback: use the raw text directly if JSON fails
    parsed = { text: raw.trim() };
  }

  const scheduledAt = computeScheduledAt(
    new Date(startsFrom),
    currentDayIndex,
    currentPostIndex,
    postsPerDay
  );

  await Post.create({
    campaign: campaignId,
    creator: userId,
    admin: userId,
    institute: instituteId,
    account: accountId,
    text: parsed.text,
    platform: planPost.platform as any,
    stage: "scheduled",
    scheduledAt,
    tags: planPost.hashtags,
    postType: "text",
  });

  // Advance the loop cursor
  const totalPostsInDay = day.posts.length;
  const isLastPostInDay = currentPostIndex >= totalPostsInDay - 1;
  const isLastDay = currentDayIndex >= plan.length - 1;

  return {
    generatedCount: generatedCount + 1,
    currentDayIndex: isLastPostInDay ? (isLastDay ? currentDayIndex : currentDayIndex + 1) : currentDayIndex,
    currentPostIndex: isLastPostInDay ? 0 : currentPostIndex + 1,
  };
}