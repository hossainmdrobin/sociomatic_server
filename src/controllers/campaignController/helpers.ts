import { groq } from "../../lib/groq";
import { model } from "./../../lib/gemini";
import campaignModel from "./../../models/campaign.model";
import { generatorPlanPrompt } from "./promtGenerator";


export const generatePlan = async (campaign_id: string) => {
    try {
        const campaign = await campaignModel.findById(campaign_id).populate("products");
        const prompt = generatorPlanPrompt(campaign)
console.log(prompt)
        const result = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: prompt,
                }
            ],
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
        })
        const text = result.choices[0].message.content;
        // console.log("Generated Plan:", text);

        return campaign;
    } catch (error) {
        console.log(error)
        throw new Error("Error generating plan");
    }
}