import { ChatGroq } from "@langchain/groq";
import { BaseMessage } from "@langchain/core/messages";
import { CallbackManagerForLLMRun } from "@langchain/core/callbacks/manager";
import { ChatResult } from "@langchain/core/outputs";

const DEFAULT_MODEL = "llama-3.3-70b-versatile";

function getModelNames(): string[] {
  const configuredModels = process.env.GROQ_MODELS || process.env.GROQ_MODEL || DEFAULT_MODEL;

  return configuredModels
    .split(",")
    .map((modelName) => modelName.trim())
    .filter(Boolean);
}

function isRateLimitError(error: unknown): boolean {
  const candidate = error as { status?: number; statusCode?: number; message?: string };
  const message = candidate?.message?.toLowerCase() || "";

  return (
    candidate?.status === 429 ||
    candidate?.statusCode === 429 ||
    message.includes("rate limit") ||
    message.includes("rate_limit") ||
    message.includes("too many requests") ||
    message.includes("quota")
  );
}

class FailoverChatGroq extends ChatGroq {
  private readonly models: ChatGroq[];
  private activeModelIndex = 0;

  constructor(modelNames: string[], temperature: number) {
    super({
      model: modelNames[0],
      temperature,
      apiKey: process.env.GROQ_API_KEY,
    });

    this.models = modelNames.map(
      (modelName) =>
        new ChatGroq({
          model: modelName,
          temperature,
          apiKey: process.env.GROQ_API_KEY,
        })
    );
  }

  override async _generate(
    messages: BaseMessage[],
    options: Parameters<ChatGroq["_generate"]>[1],
    runManager?: CallbackManagerForLLMRun
  ): Promise<ChatResult> {
    let lastError: unknown;

    for (let attempt = 0; attempt < this.models.length; attempt += 1) {
      const modelIndex = (this.activeModelIndex + attempt) % this.models.length;

      try {
        const result = await this.models[modelIndex]._generate(messages, options, runManager);
        this.activeModelIndex = modelIndex;
        return result;
      } catch (error) {
        lastError = error;

        if (!isRateLimitError(error)) {
          throw error;
        }

        this.activeModelIndex = (modelIndex + 1) % this.models.length;
        console.warn(`Groq model ${this.models[modelIndex].model} reached its limit; switching model.`);
      }
    }

    throw lastError;
  }
}

export function createGroqModel(temperature: number): ChatGroq {
  return new FailoverChatGroq(getModelNames(), temperature);
}
