import mongoose, { Schema, Document } from "mongoose";

export interface ICampaign extends Document {
    name: string;
    user: mongoose.Types.ObjectId;
    institute: mongoose.Types.ObjectId;
    account: mongoose.Types.ObjectId,
    language?:string

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
    status: "draft" | "active" | "completed" | "paused" | "planning" | "generating" | "failed";

    // Analytics (future use)
    stats?: {
        totalPosts: number;
        publishedPosts: number;
        engagement?: number;
        clicks?: number;
        conversions?: number;
    };

    // Generation tracking
    plan?: any[];
    expectedPostCount?: number;
    generatedPostCount?: number;
    errorMessage?: string;
    warningMessage?: string;

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
        account:{type:Schema.Types.ObjectId, ref:"Account", required:true},
        language:{type:String},
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
            enum: ["draft", "active", "completed", "paused", "planning", "generating", "failed"],
            default: "active",
        },

        stats: {
            totalPosts: Number,
            publishedPosts: Number,
            engagement: Number,
            clicks: Number,
            conversions: Number,
        },

        plan: {
            type: Schema.Types.Mixed,
            required: false,
        },

        expectedPostCount: {
            type: Number,
            required: false,
        },

        generatedPostCount: {
            type: Number,
            required: false,
        },

        errorMessage: {
            type: String,
            required: false,
        },

        warningMessage: {
            type: String,
            required: false,
        },

        tone: String,

        aiModel: String,
    },
    { timestamps: true }
);

export default mongoose.model<ICampaign>("Campaign", campaignSchema);