import { Job } from "agenda";
import axios from "axios";
import { Post } from './../models/post.model';
import dotenv from "dotenv";
import { Document, Types } from "mongoose";
import { Account } from "models/account.model";

const GRAPH = "https://graph.facebook.com/v19.0";

interface Account extends Document {
    token: string;
    socialId: string;
}
dotenv.config();

export default function defineFacebookJob(agenda: any) {
    agenda.define("post to facebook", { concurrency: 5 }, async (job: Job) => {
        const { postId } = job.attrs.data;

        if (!postId) return;

        const post = await Post.findById(postId)
            .populate<{ account: Account }>("account");
        if (!post || post.stage === "published") return;

        try {
            const mediaIds = [];

            for (const url of post.images) {
                const res = await axios.post(
                    `${GRAPH}/${post.account.socialId}/photos`,
                    {
                        url,
                        published: false,
                        access_token: post.account.token,
                    }
                );

                mediaIds.push({ media_fbid: res.data.id });
            }
            const url = "https://graph.facebook.com/v19.0/me/feed";

            const response = await axios.post(url, null, {
                params: {
                    message: post.text,
                    attached_media: mediaIds,
                    access_token: post?.account?.token, // Ensure you have the correct access token
                },
            });

            post.stage = "published";
            post.publishedAt = new Date();
            post.socialId = response.data.id;
            await post.save();

            console.log(`✅ Posted to Facebook: ${response.data.id}`);
        } catch (error: any) {
            console.error(`❌ Error posting to Facebook:`, error.response?.data || error.message);
        }
    });
}
