import { tool } from "@langchain/core/tools";
import {z} from 'zod';
import Product from "../../../models/products.model";

/* =========================================================
   PRODUCT TOOLS
========================================================= */

export const getProduct = tool(
  async ({ productId }: { productId: string }) => {
    try {
      const product = await Product.findById(productId).lean();
      
      if (!product) {
        return {
          success: false,
          error: `Product with ID ${productId} not found`,
        };
      }

      return {
        success: true,
        product: {
          id: product._id.toString(),
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          brand: product.brand,
          material: product.material,
          features: product.features,
          tags: product.tags,
          targetAudience: product.targetAudience,
          stock: product.stock,
          status: product.status,
          images: product.images,
          videos: product.videos,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve product: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
  {
    name: "get_product",
    description:
      "Get complete information about a single product by its ID.",
    schema: z.object({
      productId: z.string().describe("The unique identifier of the product"),
    }),
  }
);

export const getProducts = tool(
  async ({ productIds }: { productIds: string[] }) => {
    try {
      const products = await Product.find({ _id: { $in: productIds } }).lean();
      
      if (products.length === 0) {
        return {
          success: false,
          error: "No products found with the provided IDs",
        };
      }

      return {
        success: true,
        products: products.map((product) => ({
          id: product._id.toString(),
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          brand: product.brand,
          material: product.material,
          features: product.features,
          tags: product.tags,
          targetAudience: product.targetAudience,
          stock: product.stock,
          status: product.status,
          images: product.images,
          videos: product.videos,
        })),
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve products: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
  {
    name: "get_products",
    description:
      "Get complete information about multiple selected products.",
    schema: z.object({
      productIds: z.array(z.string()).describe("Array of product IDs to retrieve"),
    }),
  }
);

