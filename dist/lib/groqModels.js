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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGroqModel = createGroqModel;
const groq_1 = require("@langchain/groq");
const DEFAULT_MODEL = "llama-3.3-70b-versatile";
function getModelNames() {
    const configuredModels = process.env.GROQ_MODELS || process.env.GROQ_MODEL || DEFAULT_MODEL;
    return configuredModels
        .split(",")
        .map((modelName) => modelName.trim())
        .filter(Boolean);
}
function isRateLimitError(error) {
    var _a;
    const candidate = error;
    const message = ((_a = candidate === null || candidate === void 0 ? void 0 : candidate.message) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || "";
    return ((candidate === null || candidate === void 0 ? void 0 : candidate.status) === 429 ||
        (candidate === null || candidate === void 0 ? void 0 : candidate.statusCode) === 429 ||
        message.includes("rate limit") ||
        message.includes("rate_limit") ||
        message.includes("too many requests") ||
        message.includes("quota"));
}
class FailoverChatGroq extends groq_1.ChatGroq {
    constructor(modelNames, temperature) {
        super({
            model: modelNames[0],
            temperature,
            apiKey: process.env.GROQ_API_KEY,
        });
        this.activeModelIndex = 0;
        this.models = modelNames.map((modelName) => new groq_1.ChatGroq({
            model: modelName,
            temperature,
            apiKey: process.env.GROQ_API_KEY,
        }));
    }
    _generate(messages, options, runManager) {
        return __awaiter(this, void 0, void 0, function* () {
            let lastError;
            for (let attempt = 0; attempt < this.models.length; attempt += 1) {
                const modelIndex = (this.activeModelIndex + attempt) % this.models.length;
                try {
                    const result = yield this.models[modelIndex]._generate(messages, options, runManager);
                    this.activeModelIndex = modelIndex;
                    return result;
                }
                catch (error) {
                    lastError = error;
                    if (!isRateLimitError(error)) {
                        throw error;
                    }
                    this.activeModelIndex = (modelIndex + 1) % this.models.length;
                    console.warn(`Groq model ${this.models[modelIndex].model} reached its limit; switching model.`);
                }
            }
            throw lastError;
        });
    }
}
function createGroqModel(temperature) {
    return new FailoverChatGroq(getModelNames(), temperature);
}
