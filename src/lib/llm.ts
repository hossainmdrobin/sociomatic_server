import Groq from "groq-sdk";

export interface LLMConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

const DEFAULT_CONFIG: LLMConfig = {
  apiKey: process.env.GROQ_API_KEY || "",
  model: "llama-3.3-70b-versatile",
  maxTokens: 4096,
  temperature: 0.7,
};

export class LLMService {
  private client: Groq;
  private config: LLMConfig;

  constructor(config: Partial<LLMConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.client = new Groq({ apiKey: this.config.apiKey });
  }

  async complete(prompt: string, options: Partial<LLMConfig> = {}): Promise<string> {
    const finalConfig = { ...this.config, ...options };

    const response = await this.client.chat.completions.create({
      model: finalConfig.model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: finalConfig.maxTokens,
      temperature: finalConfig.temperature,
      response_format: { type: "json_object" },
    });

    return response.choices[0]?.message?.content || "";
  }

  async completeWithRetry(prompt: string, maxRetries: number = 2): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.complete(prompt);
      } catch (error) {
        lastError = error as Error;
        console.error(`LLM attempt ${attempt} failed:`, error);

        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    throw new Error(`LLM failed after ${maxRetries} attempts: ${lastError?.message}`);
  }
}

export const llmService = new LLMService();
export default llmService;
