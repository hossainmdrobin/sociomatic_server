import axios from "axios";
import { Post } from './../../models/post.model';
import dotenv from 'dotenv'
dotenv.config();

interface Account extends Document {
    token: string;
}
export const postToFacebook = async (postId: string) => {
    if (!postId) return;

    const post = await Post.findById(postId).populate<{ account: Account }>("account");
    if (!post || post.stage === "published") return;

    try {
        const url = "https://graph.facebook.com/v19.0/me/feed";

        const response = await axios.post(url, null, {
            params: {
                message: post.text,
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


}