export interface ParseResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export function parseJSON<T>(input: string): ParseResult<T> {
  try {
    let cleaned = input.trim();
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();

    const data = JSON.parse(cleaned) as T;
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: `JSON parse error: ${(error as Error).message}`,
    };
  }
}

export function cleanJSONString(input: string): string {
  let cleaned = input.trim();
  cleaned = cleaned.replace(/^```json\s*/gi, "").replace(/^```\s*/gi, "").replace(/```$/gi, "");
  cleaned = cleaned.trim();
  return cleaned;
}
