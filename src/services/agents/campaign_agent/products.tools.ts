import { tool } from "@langchain/core/tools";
import {z} from 'zod';

/* =========================================================
   PRODUCT TOOLS
========================================================= */

export const getProducts = tool(
  async ({ productIds }: { productIds: string[] }) => {
    // Replace this with your service/repository.
    // DO NOT put mongoose logic here.
    return {
      products: productIds.map((id) => ({
        id,
        name: `Product ${id}`,
        description: "Product information from database",
        price: 800,
        category: "cotton-three-piece",
      })),
    };
  },
  {
    name: "get_products",
    description:
      "Get complete information about the selected products.",
    schema: z.object({
      productIds: z.array(z.string()),
    }),
  }
);