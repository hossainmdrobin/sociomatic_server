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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlatformRules = void 0;
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
/* =========================================================
   SOCIAL MEDIA TOOLS
========================================================= */
exports.getPlatformRules = (0, tools_1.tool)((_a) => __awaiter(void 0, [_a], void 0, function* ({ platform }) {
    var _b;
    const rules = {
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
    return (_b = rules[platform]) !== null && _b !== void 0 ? _b : {};
}), {
    name: "get_platform_rules",
    description: "Get content requirements and best practices for a social platform.",
    schema: zod_1.z.object({
        platform: zod_1.z.string(),
    }),
});
