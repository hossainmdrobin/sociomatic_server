import { z } from "zod";
import { ChatGroq } from "@langchain/groq";
import { StateGraph, START, END } from "@langchain/langgraph";

// 1. Define output schema
const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
});

// 2. Define graph state
const GraphState = z.object({
  text: z.string(),
  result: UserSchema.optional(),
});

// 3. Create model with structured output
const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY!,
  model: "llama-3.3-70b-versatile",
}).withStructuredOutput(UserSchema);

// 4. Node function
async function extractUserInfo(state: z.infer<typeof GraphState>) {
  const result = await llm.invoke(
    `Extract user info from: ${state.text}`
  );

  return { result };
}

// 5. Build graph
const graph = new StateGraph(GraphState)
  .addNode("extract", extractUserInfo)
  .addEdge(START, "extract")
  .addEdge("extract", END)
  .compile();

// 6. Run graph
export async function testGraphLangAgent() {
const output = await graph.invoke({
  text: "My name is Robin and I am 45 years old.",
});

console.log(output.result);
}