"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractProductFromUrl = void 0;
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const axios_1 = __importDefault(require("axios"));
function extractJsonLd(html) {
    const regex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = regex.exec(html)) !== null) {
        try {
            const data = JSON.parse(match[1].trim());
            if ((data === null || data === void 0 ? void 0 : data["@type"]) === "Product" || (Array.isArray(data === null || data === void 0 ? void 0 : data["@type"]) && data["@type"].includes("Product"))) {
                return data;
            }
        }
        catch (_a) {
            continue;
        }
    }
    return null;
}
function extractMetaContent(html, property) {
    const regex = new RegExp(`<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']`, "i");
    const match = html.match(regex);
    return (match === null || match === void 0 ? void 0 : match[1]) || undefined;
}
function extractFirstText(html, selector) {
    var _a;
    const tag = selector.replace(/[#.\[]/g, "");
    const regex = new RegExp(`<${tag}[^>]*>([^<]+)</${tag}>`, "i");
    const match = html.match(regex);
    return ((_a = match === null || match === void 0 ? void 0 : match[1]) === null || _a === void 0 ? void 0 : _a.trim()) || undefined;
}
exports.extractProductFromUrl = (0, tools_1.tool)((_a) => __awaiter(void 0, [_a], void 0, function* ({ url }) {
    var _b, _c, _d, _e, _f, _g, _h;
    try {
        const { data: html } = yield axios_1.default.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
            timeout: 15000,
        });
        const productData = extractJsonLd(html);
        const title = (productData === null || productData === void 0 ? void 0 : productData.name) ||
            extractFirstText(html, "h1") ||
            extractMetaContent(html, "og:title") ||
            "";
        const description = (productData === null || productData === void 0 ? void 0 : productData.description) ||
            extractMetaContent(html, "description") ||
            extractMetaContent(html, "og:description") ||
            "";
        const priceRaw = ((_b = productData === null || productData === void 0 ? void 0 : productData.offers) === null || _b === void 0 ? void 0 : _b.price) ||
            ((_d = (_c = productData === null || productData === void 0 ? void 0 : productData.offers) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.price) ||
            extractMetaContent(html, "product:price:amount");
        const price = priceRaw ? parseFloat(String(priceRaw).replace(/[^0-9.]/g, "")) : undefined;
        const currency = ((_e = productData === null || productData === void 0 ? void 0 : productData.offers) === null || _e === void 0 ? void 0 : _e.priceCurrency) ||
            ((_g = (_f = productData === null || productData === void 0 ? void 0 : productData.offers) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.priceCurrency) ||
            extractMetaContent(html, "product:price:currency") ||
            undefined;
        const brand = ((_h = productData === null || productData === void 0 ? void 0 : productData.brand) === null || _h === void 0 ? void 0 : _h.name) ||
            (productData === null || productData === void 0 ? void 0 : productData.brand) ||
            extractMetaContent(html, "og:brand") ||
            undefined;
        const ogImage = extractMetaContent(html, "og:image");
        const productImages = (productData === null || productData === void 0 ? void 0 : productData.image)
            ? Array.isArray(productData.image)
                ? productData.image
                : [productData.image]
            : [];
        const images = ogImage
            ? [ogImage, ...productImages.filter((img) => img !== ogImage)]
            : productImages;
        const category = (productData === null || productData === void 0 ? void 0 : productData.category) ||
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
    }
    catch (error) {
        return {
            success: false,
            url,
            error: error.message || "Failed to extract product data",
        };
    }
}), {
    name: "extract_product_from_url",
    description: "Fetch and extract structured product information from a product page URL. Returns title, description, price, images, brand and category.",
    schema: zod_1.z.object({
        url: zod_1.z.string().url(),
    }),
});
