
import { tool } from "@langchain/core/tools";
import {z} from 'zod'
/* =========================================================
   SOCIAL MEDIA TOOLS
========================================================= */

export const getPlatformRules = tool(
  async ({ platform }: { platform: string }) => {
    const rules: Record<string, unknown> = {
      facebook: {
        preferred: ["image", "video", "carousel"],
        style: "conversational",
      },

      instagram: {
        preferred: ["reel", "carousel", "image"],
        style: "visual-first",
      },

      tiktok: {
        preferred: ["short-video"],
        style: "hook-driven",
      },
    };

    return rules[platform] ?? {};
  },
  {
    name: "get_platform_rules",
    description:
      "Get content requirements and best practices for a social platform.",
    schema: z.object({
      platform: z.string(),
    }),
  }
);
