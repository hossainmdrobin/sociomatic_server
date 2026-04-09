import mongoose, { Schema, Document } from "mongoose";

/* =========================
   Post Interface
========================= */
export interface IPlanPost {
    type:
        | "product_showcase"
        | "educational"
        | "promotional"
        | "engagement"
        | "testimonial"
        | "other";

    platform: string;

    title: string;
    caption: string;

    hashtags: string[];
    cta?: string;

    mediaSuggestion?: "image" | "carousel" | "video" | "reel";
}

/* =========================
   Day Interface
========================= */
export interface IPlanDay {
    day: number;
    date: string; // keep string to match "YYYY-MM-DD"
    posts: IPlanPost[];
}

/* =========================
   Plan Interface
========================= */
export interface IPlan extends Document {
    plan: IPlanDay[];
}

/* =========================
   Schema
========================= */

const postSchema = new Schema<IPlanPost>(
    {
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
    },
    { _id: false }
);

const daySchema = new Schema<IPlanDay>(
    {
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
    },
    { _id: false }
);

const planSchema = new Schema<IPlan>(
    {
        plan: {
            type: [daySchema],
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model<IPlan>("Plan", planSchema);