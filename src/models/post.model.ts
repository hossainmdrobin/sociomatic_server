import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    editor: [{ type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: false }],
    account:{type:mongoose.Schema.Types.ObjectId,ref:"Account"},
    text: { type: String, required: true },
    image: [{ type: String, required: false }],
    video: [{ type: String, required: false }],
    platform: [{ type: String, required: true, default: "facebook", enum: ["facebook", "instagram", "twitter", "linkedin"] }],
    stage: { type: String, required: true, default: "draft", enum: ["draft", "published", "deleted", "scheduled"] },
    budget: { type: Number, required: false, default: 0 },
    scheduledAt: { type: Date, required: false },
    publishedAt: { type: Date, required: false },
    deletedAt: { type: Date, required: false },
    tags: [{ type: String, required: false }],
    labels: [{ type: String, required: false }],
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: false },
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    postLinks: [{
        url: { type: String, required: true },
        platform: { type: String, required: true, enum: ["facebook", "instagram", "twitter", "linkedin"] },
        createdAt: { type: Date, default: Date.now }
    }],
    postType: { type: String, required: false, enum: ["text", "image", "video", "link"] },

}, {
    timestamps: true
});

export const Post = mongoose.model("Post", postSchema);
