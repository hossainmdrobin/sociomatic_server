"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.plannerAgent = exports.PlannerAgent = void 0;
const llm_1 = __importDefault(require("../../lib/llm"));
const validator_agent_1 = __importDefault(require("./validator.agent"));
const POSTS_PER_DAY = 5;
class PlannerAgent {
    constructor(postsPerDay = POSTS_PER_DAY) {
        this.postsPerDay = postsPerDay;
    }
    createPlan(campaign) {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = this.buildPrompt(campaign);
            const rawOutput = yield llm_1.default.completeWithRetry(prompt);
            const result = yield validator_agent_1.default.validate(rawOutput, { type: "array", items: { type: "object", properties: { day: {}, theme: {} } } });
            if (!result.success || !result.data) {
                throw new Error(`Failed to generate plan: ${result.error}`);
            }
            const themes = result.data.map((t, index) => ({
                day: t.day || index + 1,
                theme: t.theme,
                focusArea: t.focusArea,
            }));
            return {
                campaignId: campaign._id.toString(),
                themes,
                totalPosts: themes.length * this.postsPerDay,
            };
        });
    }
    buildPrompt(campaign) {
        const { name, goals, description, duration, postsPerDay, platforms, tone } = campaign;
        const productList = campaign.products && campaign.products.length > 0
            ? campaign.products.map((p) => `- ${p.name}: ${p.description || "No description"}`).join("\n")
            : "No specific products";
        return `You are a professional social media marketing strategist. Create a content plan for a marketing campaign.

Campaign Details:
- Name: ${name}
- Description: ${description || goals}
- Goal: ${goals}
- Target Tone: ${tone || "professional and friendly"}
- Platforms: ${(platforms || []).join(", ") || "facebook, instagram, linkedin, twitter"}
- Duration: ${duration} days
- Posts Per Day: ${postsPerDay || 5}

Products/Services:
${productList}

Generate a content plan with themes for each day. Each theme should be engaging and varied. The themes should cover:
- Product showcases
- Educational content
- Promotional posts
- Engagement posts (polls, questions)
- Testimonials/reviews
- Behind the scenes
- Offers/discounts
- Storytelling

Return ONLY a valid JSON array with this exact structure:
[{"day": 1, "theme": "theme description"}, {"day": 2, "theme": "theme description"}]

Generate themes for at least ${duration} days to create ${duration * (postsPerDay || 5)}+ posts. Make themes diverse and strategic.`;
    }
    splitIntoBatches(themes, batchSize = 5) {
        const batches = [];
        for (let i = 0; i < themes.length; i += batchSize) {
            batches.push(themes.slice(i, i + batchSize));
        }
        return batches;
    }
}
exports.PlannerAgent = PlannerAgent;
exports.plannerAgent = new PlannerAgent();
exports.default = exports.plannerAgent;
