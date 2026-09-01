import { tool } from "@langchain/core/tools";
import { z } from "zod";
import axios from "axios";

function extractJsonLd(html: string): Record<string, any> | null {
  const regex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1].trim());
      if (data?.["@type"] === "Product" || (Array.isArray(data?.["@type"]) && data["@type"].includes("Product"))) {
        return data;
      }
    } catch {
      continue;
    }
  }
  return null;
}

function extractMetaContent(html: string, property: string): string | undefined {
  const regex = new RegExp(
    `<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']`,
    "i"
  );
  const match = html.match(regex);
  return match?.[1] || undefined;
}

function extractFirstText(html: string, selector: string): string | undefined {
  const tag = selector.replace(/[#.\[]/g, "");
  const regex = new RegExp(`<${tag}[^>]*>([^<]+)</${tag}>`, "i");
  const match = html.match(regex);
  return match?.[1]?.trim() || undefined;
}

export const extractProductFromUrl = tool(
  async ({ url }: { url: string }) => {
    try {
      const { data: html } = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        timeout: 15000,
      });

      const productData = extractJsonLd(html);

      const title =
        productData?.name ||
        extractFirstText(html, "h1") ||
        extractMetaContent(html, "og:title") ||
        "";

      const description =
        productData?.description ||
        extractMetaContent(html, "description") ||
        extractMetaContent(html, "og:description") ||
        "";

      const priceRaw =
        productData?.offers?.price ||
        productData?.offers?.[0]?.price ||
        extractMetaContent(html, "product:price:amount");

      const price = priceRaw ? parseFloat(String(priceRaw).replace(/[^0-9.]/g, "")) : undefined;

      const currency =
        productData?.offers?.priceCurrency ||
        productData?.offers?.[0]?.priceCurrency ||
        extractMetaContent(html, "product:price:currency") ||
        undefined;

      const brand =
        productData?.brand?.name ||
        productData?.brand ||
        extractMetaContent(html, "og:brand") ||
        undefined;

      const ogImage = extractMetaContent(html, "og:image");
      const productImages = productData?.image
        ? Array.isArray(productData.image)
          ? productData.image
          : [productData.image]
        : [];
      const images = ogImage
        ? [ogImage, ...productImages.filter((img) => img !== ogImage)]
        : productImages;

      const category =
        productData?.category ||
        extractMetaContent(html, "product:category") ||
        undefined;

      return {
        success: true,
        url,
        extracted: {
          title,
          description,
          price,
          currency,
          brand,
          images,
          category,
          rawJsonLd: productData || null,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        url,
        error: error.message || "Failed to extract product data",
      };
    }
  },
  {
    name: "extract_product_from_url",
    description:
      "Fetch and extract structured product information from a product page URL. Returns title, description, price, images, brand and category.",
    schema: z.object({
      url: z.string().url(),
    }),
  }
);
