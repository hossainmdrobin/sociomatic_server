import mongoose, { Schema, Document } from "mongoose";

export interface ICampaign extends Document {
    name: string;
    user: mongoose.Types.ObjectId;
    institute: mongoose.Types.ObjectId;

    // Core inputs
    goals: string; // e.g. "Increase sales", "Brand awareness"
    description?: string;
    startsFrom: Date;

    products: mongoose.Types.ObjectId[];

    // Campaign config
    postsPerDay: number;
    duration: number; // in days
    platforms: string[];

    // Status tracking
    status: "draft" | "active" | "completed" | "paused";

    // Analytics (future use)
    stats?: {
        totalPosts: number;
        publishedPosts: number;
        engagement?: number;
        clicks?: number;
        conversions?: number;
    };

    // Optional improvements
    tone?: string; // optional AI tone control
    aiModel?: string; // which model generated this

    createdAt: Date;
    updatedAt: Date;
}

const campaignSchema = new Schema<ICampaign>(
    {
        name: {
            type: String,
            required: true,
        },
        startsFrom: {
            type: Date,
            required: false,
        },
        institute: {
            type: Schema.Types.ObjectId,
            ref: "Institute",
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },

        goals: {
            type: String,
            required: true,
        },

        description: {
            type: String,
        },

        products: [
            {
                type: Schema.Types.ObjectId,
                ref: "Product",
            },
        ],

        postsPerDay: {
            type: Number,
            default: 4,
        },

        duration: {
            type: Number,
            default: 14,
        },

        platforms: [
            {
                type: String,
            },
        ],

        status: {
            type: String,
            enum: ["draft", "active", "completed", "paused"],
            default: "active",
        },

        stats: {
            totalPosts: Number,
            publishedPosts: Number,
            engagement: Number,
            clicks: Number,
            conversions: Number,
        },

        tone: String,

        aiModel: String,
    },
    { timestamps: true }
);

export default mongoose.model<ICampaign>("Campaign", campaignSchema);