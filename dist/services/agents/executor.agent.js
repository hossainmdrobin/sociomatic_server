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
exports.executorAgent = exports.ExecutorAgent = void 0;
const llm_1 = __importDefault(require("../../lib/llm"));
const validator_agent_1 = __importDefault(require("./validator.agent"));
const post_model_1 = require("../../models/post.model");
const POSTS_PER_THEME = 5;
class ExecutorAgent {
    constructor(postsPerTheme = POSTS_PER_THEME) {
        this.postsPerTheme = postsPerTheme;
    }
    execute(campaign, themes) {
        return __awaiter(this, void 0, void 0, function* () {
            const allPosts = [];
            for (const theme of themes) {
                const posts = yield this.generatePostsForTheme(campaign, theme);
                allPosts.push(...posts);
            }
            return allPosts;
        });
    }
    generatePostsForTheme(campaign, theme) {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = this.buildPrompt(campaign, theme);
            const rawOutput = yield llm_1.default.completeWithRetry(prompt);
            const result = yield validator_agent_1.default.validate(rawOutput, {
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
            });
            if (!result.success || !result.data) {
                console.error(`Failed to generate posts for theme ${theme.theme}: ${result.error}`);
                return [];
            }
            return result.data.map((post) => (Object.assign(Object.assign({}, post), { day: post.day || theme.day, theme: post.theme || theme.theme })));
        });
    }
    buildPrompt(campaign, theme) {
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
    savePosts(posts, campaignId, adminId, instituteId, accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (posts.length === 0)
                return 0;
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
            yield post_model_1.Post.insertMany(postDocuments);
            return postDocuments.length;
        });
    }
}
exports.ExecutorAgent = ExecutorAgent;
exports.executorAgent = new ExecutorAgent();
exports.default = exports.executorAgent;
