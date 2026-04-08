import Groq from "groq-sdk";

// 1. Initialize with your API Key
// Ensure your .env has GROQ_API_KEY
export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});