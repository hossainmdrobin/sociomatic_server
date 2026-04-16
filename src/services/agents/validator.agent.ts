import { parseJSON, cleanJSONString, ParseResult } from "../../utils/jsonParser";
import llmService from "../../lib/llm";

export interface ValidatorConfig {
  maxRetries: number;
  retryDelayMs: number;
}

const DEFAULT_VALIDATOR_CONFIG: ValidatorConfig = {
  maxRetries: 2,
  retryDelayMs: 1000,
};

export class ValidatorAgent {
  private config: ValidatorConfig;

  constructor(config: Partial<ValidatorConfig> = {}) {
    this.config = { ...DEFAULT_VALIDATOR_CONFIG, ...config };
  }

  async validate<T>(rawOutput: string, schema: object): Promise<ParseResult<T>> {
    let result = parseJSON<T>(rawOutput);

    if (result.success && this.validateSchema(result.data, schema)) {
      return result;
    }

    const cleaned = cleanJSONString(rawOutput);
    result = parseJSON<T>(cleaned);

    if (result.success && this.validateSchema(result.data, schema)) {
      return result;
    }

    if (this.config.maxRetries > 0) {
      return await this.fixWithLLM(rawOutput, schema);
    }

    return {
      success: false,
      error: "Failed to parse valid JSON after all retries",
    };
  }

  private async fixWithLLM<T>(rawOutput: string, schema: object): Promise<ParseResult<T>> {
    const fixPrompt = `You are a JSON validator and fixer. Given the following raw output, fix any JSON syntax errors and ensure it conforms to the schema.

Raw output:
${rawOutput}

Schema:
${JSON.stringify(schema, null, 2)}

Return ONLY valid JSON. No markdown. No explanation. Fix any malformed JSON.`;

    try {
      const fixedOutput = await llmService.completeWithRetry(fixPrompt, 1);
      return parseJSON<T>(fixedOutput);
    } catch (error) {
      return {
        success: false,
        error: `LLM fix failed: ${(error as Error).message}`,
      };
    }
  }

  private validateSchema(data: unknown, _schema: object): boolean {
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

export const validatorAgent = new ValidatorAgent();
export default validatorAgent;
