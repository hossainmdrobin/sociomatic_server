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
exports.validatorAgent = exports.ValidatorAgent = void 0;
const jsonParser_1 = require("../../utils/jsonParser");
const llm_1 = __importDefault(require("../../lib/llm"));
const DEFAULT_VALIDATOR_CONFIG = {
    maxRetries: 2,
    retryDelayMs: 1000,
};
class ValidatorAgent {
    constructor(config = {}) {
        this.config = Object.assign(Object.assign({}, DEFAULT_VALIDATOR_CONFIG), config);
    }
    validate(rawOutput, schema) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = (0, jsonParser_1.parseJSON)(rawOutput);
            if (result.success && this.validateSchema(result.data, schema)) {
                return result;
            }
            const cleaned = (0, jsonParser_1.cleanJSONString)(rawOutput);
            result = (0, jsonParser_1.parseJSON)(cleaned);
            if (result.success && this.validateSchema(result.data, schema)) {
                return result;
            }
            if (this.config.maxRetries > 0) {
                return yield this.fixWithLLM(rawOutput, schema);
            }
            return {
                success: false,
                error: "Failed to parse valid JSON after all retries",
            };
        });
    }
    fixWithLLM(rawOutput, schema) {
        return __awaiter(this, void 0, void 0, function* () {
            const fixPrompt = `You are a JSON validator and fixer. Given the following raw output, fix any JSON syntax errors and ensure it conforms to the schema.

Raw output:
${rawOutput}

Schema:
${JSON.stringify(schema, null, 2)}

Return ONLY valid JSON. No markdown. No explanation. Fix any malformed JSON.`;
            try {
                const fixedOutput = yield llm_1.default.completeWithRetry(fixPrompt, 1);
                return (0, jsonParser_1.parseJSON)(fixedOutput);
            }
            catch (error) {
                return {
                    success: false,
                    error: `LLM fix failed: ${error.message}`,
                };
            }
        });
    }
    validateSchema(data, _schema) {
        if (data === null || data === undefined) {
            return false;
        }
        if (Array.isArray(data)) {
            return data.length > 0;
        }
        if (typeof data === "object") {
            return Object.keys(data).length > 0;
        }
        return true;
    }
}
exports.ValidatorAgent = ValidatorAgent;
exports.validatorAgent = new ValidatorAgent();
exports.default = exports.validatorAgent;
