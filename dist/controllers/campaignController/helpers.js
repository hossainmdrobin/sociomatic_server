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
exports.generatePlan = void 0;
const groq_1 = require("../../lib/groq");
// import { model } from "./../../lib/gemini";
const campaign_model_1 = __importDefault(require("./../../models/campaign.model"));
const promtGenerator_1 = require("./promtGenerator");
const generatePlan = (campaign_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaign = yield campaign_model_1.default.findById(campaign_id).populate("products");
        const prompt = (0, promtGenerator_1.generatorPlanPrompt)(campaign);
        const message = [
            {
                role: "user",
                content: prompt,
            }
        ];
        for (let i = 0; i < ((campaign === null || campaign === void 0 ? void 0 : campaign.duration) || 0); i++) {
            if (i > 0) {
                message.push({
                    role: "user",
                    content: `Now, generate the plan for day ${i + 1} based on the previous days and the campaign details.`
                });
            }
            const result = yield groq_1.groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: message,
                temperature: 0.7,
                max_tokens: 1024,
                top_p: 1,
                stream: false,
            });
            const text = result.choices[0].message.content;
            message.push({ role: 'assistant', content: text || "" });
        }
        let posts = [];
        message.filter(m => m.role === "assistant")
            .forEach(m => {
            try {
                const cleanContent = m.content.replace(/```json/g, "").replace(/```/g, "").trim();
                const parsed = JSON.parse(cleanContent);
                posts = posts.concat(parsed);
            }
            catch (e) {
                throw new Error("Error parsing plan JSON: " + e);
            }
        });
        console.log("Generated Posts Plan:", posts, posts.length);
        return posts;
    }
    catch (error) {
        console.log(error);
        throw new Error("Error generating plan");
    }
});
exports.generatePlan = generatePlan;
