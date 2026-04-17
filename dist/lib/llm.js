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
exports.llmService = exports.LLMService = void 0;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const DEFAULT_CONFIG = {
    apiKey: process.env.GROQ_API_KEY || "",
    model: "llama-3.3-70b-versatile",
    maxTokens: 4096,
    temperature: 0.7,
};
class LLMService {
    constructor(config = {}) {
        this.config = Object.assign(Object.assign({}, DEFAULT_CONFIG), config);
        this.client = new groq_sdk_1.default({ apiKey: this.config.apiKey });
    }
    complete(prompt_1) {
        return __awaiter(this, arguments, void 0, function* (prompt, options = {}) {
            var _a, _b;
            const finalConfig = Object.assign(Object.assign({}, this.config), options);
            const response = yield this.client.chat.completions.create({
                model: finalConfig.model,
                messages: [{ role: "user", content: prompt }],
                max_tokens: finalConfig.maxTokens,
                temperature: finalConfig.temperature,
                response_format: { type: "json_object" },
            });
            return ((_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || "";
        });
    }
    completeWithRetry(prompt_1) {
        return __awaiter(this, arguments, void 0, function* (prompt, maxRetries = 2) {
            let lastError = null;
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    return yield this.complete(prompt);
                }
                catch (error) {
                    lastError = error;
                    console.error(`LLM attempt ${attempt} failed:`, error);
                    if (attempt < maxRetries) {
                        yield new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
                    }
                }
            }
            throw new Error(`LLM failed after ${maxRetries} attempts: ${lastError === null || lastError === void 0 ? void 0 : lastError.message}`);
        });
    }
}
exports.LLMService = LLMService;
exports.llmService = new LLMService();
exports.default = exports.llmService;
