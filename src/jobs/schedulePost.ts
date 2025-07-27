import { Job } from "agenda";
import { Post } from "models/post.model";


export default function schedulePost(agenda:any){
    agenda.define('schedule post',{concurrency:5},async(job:Job)=>{
        const posts = await Post.find({scheduledAt: {$lte: new Date()}});
        if(posts.length === 0) return;
        for(const post of posts){
            agenda.schedule()
        }
    })

}