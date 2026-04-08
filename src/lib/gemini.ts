import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// console.log(process.env.GEMINI_API_KEY)
// export const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
// });

export const model = genAI.getGenerativeModel(
  { model: "gemini-1.5-flash" },
  { apiVersion: 'v1' } // This forces the stable production endpoint
);