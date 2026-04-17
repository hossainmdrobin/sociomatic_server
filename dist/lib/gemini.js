"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.model = void 0;
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// console.log(process.env.GEMINI_API_KEY)
// export const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
// });
exports.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1' } // This forces the stable production endpoint
);
