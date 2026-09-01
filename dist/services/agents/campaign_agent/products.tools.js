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
exports.getProducts = exports.getProduct = void 0;
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const products_model_1 = __importDefault(require("../../../models/products.model"));
/* =========================================================
   PRODUCT TOOLS
========================================================= */
exports.getProduct = (0, tools_1.tool)((_a) => __awaiter(void 0, [_a], void 0, function* ({ productId }) {
    try {
        const product = yield products_model_1.default.findById(productId).lean();
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
    }
    catch (error) {
        return {
            success: false,
            error: `Failed to retrieve product: ${error instanceof Error ? error.message : "Unknown error"}`,
        };
    }
}), {
    name: "get_product",
    description: "Get complete information about a single product by its ID.",
    schema: zod_1.z.object({
        productId: zod_1.z.string().describe("The unique identifier of the product"),
    }),
});
exports.getProducts = (0, tools_1.tool)((_a) => __awaiter(void 0, [_a], void 0, function* ({ productIds }) {
    try {
        const products = yield products_model_1.default.find({ _id: { $in: productIds } }).lean();
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
    }
    catch (error) {
        return {
            success: false,
            error: `Failed to retrieve products: ${error instanceof Error ? error.message : "Unknown error"}`,
        };
    }
}), {
    name: "get_products",
    description: "Get complete information about multiple selected products.",
    schema: zod_1.z.object({
        productIds: zod_1.z.array(zod_1.z.string()).describe("Array of product IDs to retrieve"),
    }),
});
