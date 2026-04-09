import axios from "axios";
import { google } from "googleapis";
import { Post } from './../../models/post.model';
import dotenv from 'dotenv'
import { Notificaiton } from "../../models/notification.model";
dotenv.config();

interface Account extends Document {
    token: string;
    socialId: string;
}

// POSTING VIDEOS INCLUDING iMAGE OR VIDEO
export const postToYoutube = async (postId: string) => {
    if (!postId) return;

    try {
        const post = await Post.findById(postId).populate<{ account: Account }>("account");
        if (!post || post.stage === "published") return;

        const videoStream = await axios.get(post.videos[0], {
            responseType: "stream",
        });

        const accessTokenData = await axios.post(
            "https://oauth2.googleapis.com/token",
            new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                refresh_token: post.account.token,
                grant_type: "refresh_token",
            }),
        )

        const youtube = google.youtube({
            version: "v3",
            auth: accessTokenData?.data.access_token, // OAuth access token
        });

        const response = await youtube.videos.insert({
            part: ["snippet", "status"],
            requestBody: {
                snippet: {
                    title: "My Cloudinary Video",
                    description: "Uploaded from Cloudinary",
                    tags: ["cloudinary", "api"],
                    categoryId: "22",
                },
                status: {
                    privacyStatus: "public", // public | unlisted | private
                },
            },
            media: {
                body: videoStream.data, // ← Cloudinary stream here
            },
        });

        post.stage = "published";
        post.publishedAt = new Date();
        post.socialId = response.data.id;
        const notification = new Notificaiton({
            admin: post.admin,
            title: "New Post Published",
            message: `A new post has been published to YouTube with ID: ${response.data.id}`,
        })
        await notification.save();
        await post.save();
    } catch (error: any) {
        console.error(`❌ Error posting to YouTube:`, error.response?.data || error.message);
    }
}