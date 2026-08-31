
import {tool} from '@langchain/core/tools'
import {z} from 'zod';
export const getPreviousCampaigns = tool(
  async () => {
    // Replace with your campaign service
    return {
      campaigns: [],
    };
  },
  {
    name: "get_previous_campaigns",
    description:
      "Get previous campaigns to avoid repetitive content and learn what worked.",
    schema: z.object({}),
  }
);