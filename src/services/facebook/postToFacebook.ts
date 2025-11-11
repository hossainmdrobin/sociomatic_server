import axios from "axios";
import { Post } from './../../models/post.model';
import dotenv from 'dotenv'
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
        await post.save();

        console.log(`✅ Posted to Facebook: ${response.data.id}`);
    } catch (error: any) {
        console.error(`❌ Error posting to Facebook:`, error.response?.data || error.message);
    }
}