import axios from "axios";
import { Post } from './../../models/post.model';
import dotenv from 'dotenv'
import { Notificaiton } from "../../models/notification.model";
import { access } from "fs";
import { deserialize } from "v8";
dotenv.config();
const GRAPH = "https://graph.facebook.com/v19.0";

interface Account extends Document {
    token: string;
    socialId: string;
}

// POSTING VIDEOS INCLUDING iMAGE OR VIDEO
export const postToFacebook = async (postId: string) => {
    if (!postId) return;

    const post = await Post.findById(postId).populate<{ account: Account }>("account");
    if (!post || post.stage === "published") return;

    try {
        // UPLOADING VIDEO IF EXISTS
        if (post.videos && post.videos.length > 0) {
            const res = await axios.post(`https://graph.facebook.com/v17.0/${post.account.socialId}/videos`, {
                file_url: post.videos[0],
                access_token: post.account.token,
                description: post.text
            });
            console.log("Video upload response:", res);

            post.stage = "published";
            post.publishedAt = new Date();
            post.socialId = res.data.id;
            const notification = new Notificaiton({
                admin: post.admin,
                title: "New Post Published",
                message: `A new post has been published to Facebook with ID: ${res.data.id}`,
            })
            await notification.save();
            await post.save();
            return;
        }


        // UPLOADING IMAGES IF EXISTS
        const mediaIds = [];
        console.log("Uplaoding images to Facebook...");

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
        const notification = new Notificaiton({
            admin: post.admin,
            title: "New Post Published",
            message: `A new post has been published to Facebook with ID: ${response.data.id}`,
        })
        await notification.save();
        await post.save();
    } catch (error: any) {
        console.error(`❌ Error posting to Facebook:`, error.response?.data || error.message);
    }
}