import { groq } from "../../lib/groq";
// import { model } from "./../../lib/gemini";
import campaignModel from "./../../models/campaign.model";
import { generatorPlanPrompt } from "./promtGenerator";


export const generatePlan = async (campaign_id: string) => {
    try {
        const campaign = await campaignModel.findById(campaign_id).populate("products");
        const prompt = generatorPlanPrompt(campaign)
        console.log(prompt)
        const message: { role: "user" | "assistant"; content: string }[] = [
            {
                role: "user",
                content: prompt,
            }
        ]

        for (let i = 0; i < (campaign?.duration || 0); i++) {
            if (i > 0) {
                message.push({
                    role: "user",
                    content: `Now, generate the plan for day ${i + 1} based on the previous days and the campaign details.`
                })
            }
            const result = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: message,
                temperature: 0.7,
                max_tokens: 1024,
                top_p: 1,
                stream: false,
            })
            const text = result.choices[0].message.content;
            message.push({ role: 'assistant', content: text || "" })
        }
        let posts: any[] = []
        message.filter(m => m.role === "assistant")
            .forEach(m => {
                try {
                    const cleanContent = m.content.replace(/```json/g, "").replace(/```/g, "").trim();
                    const parsed = JSON.parse(cleanContent);
                    posts = posts.concat(parsed);
                } catch (e) {
                    throw new Error("Error parsing plan JSON: " + e);
                }
            })
        console.log("Generated Posts Plan:", posts, posts.length);
        return posts;
    } catch (error) {
        console.log(error)
        throw new Error("Error generating plan");
    }
}