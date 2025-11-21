import axios from "axios";
import { Post } from './../../models/post.model';
import dotenv from 'dotenv'
import { Notificaiton } from "../../models/notification.model";
dotenv.config();

interface Account extends Document {
    token: string;
    socialId: string;
}
export const postToFacebook = async (postId: string) => {
    if (!postId) return;

    const post = await Post.findById(postId).populate<{ account: Account }>("account");
    if (!post || post.stage === "published") return;

    try {
        const url = `https://graph.facebook.com/v23.0/${post?.account?.socialId}/feed?access_token=${post?.account?.token}`;
        const response = await axios.post(url,
            {
                message: post.text,
                access_token: post?.account?.token, // Ensure you have the correct access token
                published: true
            },
        );

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