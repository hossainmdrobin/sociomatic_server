import { StateGraph, END } from "@langchain/langgraph";
import Campaign from "../../src/models/campaign.model";
import Plan from "../../src/models/campaignplan.model";
import { CampaignGraphState } from "./types";
import { fetchCampaignContext } from "./tools";
import { plannerNode } from "./plannerNode";
import { postGeneratorNode } from "./postGeneratorNode";

// ── Node: fetch context ──────────────────────────────────────────────────────

async function contextNode(
  state: CampaignGraphState
): Promise<Partial<CampaignGraphState>> {
  const context = await fetchCampaignContext(state);
  return { context };
}

// ── Node: save plan to DB ────────────────────────────────────────────────────

async function savePlanNode(
  state: CampaignGraphState
): Promise<Partial<CampaignGraphState>> {
  const totalPosts = state.plan.reduce((acc, day) => acc + day.posts.length, 0);

  const planDoc = await Plan.create({ plan: state.plan });

  await Campaign.findByIdAndUpdate(state.campaignId, {
    status: "generating",
    plan: state.plan,
    expectedPostCount: totalPosts,
    generatedPostCount: 0,
    summary: `${state.duration}-day campaign across ${state.platforms.join(", ")}`,
  });

  return {};
}

// ── Node: update progress ────────────────────────────────────────────────────

async function updateProgressNode(
  state: CampaignGraphState
): Promise<Partial<CampaignGraphState>> {
  await Campaign.findByIdAndUpdate(state.campaignId, {
    generatedPostCount: state.generatedCount,
  });
  return {};
}

// ── Node: finalize ───────────────────────────────────────────────────────────

async function finalizeNode(
  state: CampaignGraphState
): Promise<Partial<CampaignGraphState>> {
  const totalPosts = state.plan.reduce((acc, day) => acc + day.posts.length, 0);

  await Campaign.findByIdAndUpdate(state.campaignId, {
    status: "active",
    generatedPostCount: totalPosts,
    "stats.totalPosts": totalPosts,
    "stats.publishedPosts": 0,
  });

  return {};
}

// ── Node: handle error ───────────────────────────────────────────────────────

async function errorNode(
  state: CampaignGraphState
): Promise<Partial<CampaignGraphState>> {
  await Campaign.findByIdAndUpdate(state.campaignId, {
    status: "failed",
    errorMessage: state.error ?? "Unknown error during generation",
  });
  return {};
}

// ── Routing: should loop or finalize? ────────────────────────────────────────

function shouldContinueLoop(state: CampaignGraphState): string {
  const totalPosts = state.plan.reduce((acc, day) => acc + day.posts.length, 0);

  if (state.generatedCount >= totalPosts) return "finalize";
  return "generate_post";
}

// ── Build the graph ──────────────────────────────────────────────────────────

export function buildCampaignGraph() {
  const graph = new StateGraph<CampaignGraphState>({
    channels: {
      campaignId: { value: (a, b) => b ?? a },
      userId: { value: (a, b) => b ?? a },
      instituteId: { value: (a, b) => b ?? a },
      accountId: { value: (a, b) => b ?? a },
      name: { value: (a, b) => b ?? a },
      goals: { value: (a, b) => b ?? a },
      description: { value: (a, b) => b ?? a },
      tone: { value: (a, b) => b ?? a },
      language: { value: (a, b) => b ?? a },
      platforms: { value: (a, b) => b ?? a },
      postsPerDay: { value: (a, b) => b ?? a },
      duration: { value: (a, b) => b ?? a },
      startsFrom: { value: (a, b) => b ?? a },
      context: { value: (a, b) => b ?? a },
      plan: { value: (a, b) => b ?? a },
      currentDayIndex: { value: (a, b) => b ?? a },
      currentPostIndex: { value: (a, b) => b ?? a },
      generatedCount: { value: (a, b) => b ?? a },
      error: { value: (a, b) => b ?? a },
    },
  });

  graph
    .addNode("fetch_context", contextNode)
    .addNode("plan", plannerNode)
    .addNode("save_plan", savePlanNode)
    .addNode("generate_post", postGeneratorNode)
    .addNode("update_progress", updateProgressNode)
    .addNode("finalize", finalizeNode)
    .addNode("error", errorNode);

  graph
    .addEdge("__start__", "fetch_context")
    .addEdge("fetch_context", "plan")
    .addEdge("plan", "save_plan")
    .addEdge("save_plan", "generate_post")
    .addEdge("generate_post", "update_progress")
    .addConditionalEdges("update_progress", shouldContinueLoop, {
      generate_post: "generate_post",
      finalize: "finalize",
    })
    .addEdge("finalize", END)
    .addEdge("error", END);

  return graph.compile();
}