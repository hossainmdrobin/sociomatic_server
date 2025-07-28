import { Post } from "./../models/post.model";

export default function schedulePost(agenda: any) {
    agenda.define('schedule post', { concurrency: 5 }, async () => {
        try {
            const posts = await Post.find({ scheduledAt: { $lte: new Date() }, stage: "saved" })
            console.log(`Found ${posts.length} posts to schedule.`);
            if (posts.length === 0) return;
            for (const post of posts) {
                agenda.schedule("in 15 seconds", 'publish post', { id: post._id.toString() });
                console.log(`Scheduled post with ID: ${post._id} to be published in 15 seconds`);
            }
        } catch (e) {
            console.error("Error in schedulePost job:", e);
        }

    })

}