"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
/* =========================
   Schema
========================= */
const postSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: [
            "product_showcase",
            "educational",
            "promotional",
            "engagement",
            "testimonial",
            "other",
        ],
        required: true,
    },
    platform: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        required: true,
    },
    hashtags: [
        {
            type: String,
        },
    ],
    cta: {
        type: String,
    },
    mediaSuggestion: {
        type: String,
        enum: ["image", "carousel", "video", "reel"],
    },
}, { _id: false });
const daySchema = new mongoose_1.Schema({
    day: {
        type: Number,
        required: true,
    },
    date: {
        type: String, // matches "YYYY-MM-DD"
        required: true,
    },
    posts: {
        type: [postSchema],
        required: true,
    },
}, { _id: false });
const planSchema = new mongoose_1.Schema({
    plan: {
        type: [daySchema],
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Plan", planSchema);
