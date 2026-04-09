import {postToFacebook} from "./../services/facebook/postToFacebook"
import {postToYoutube} from "../services/youtube/postToYoutube";

export const publishPost = async (agenda: any) => {
    agenda.define('publish post', { concurrency: 5 }, async (job: any) => {
        const { id,platform } = job.attrs.data;
        console.log(job.attrs.data);
        console.log(`Publishing post with ID: ${id} and platform: ${platform}`);
        if (!id) return;
        if(!platform) return;
        console.log("I am here ",platform == "facebook" )
        if(platform == "facebook"){
            await postToFacebook(id);
        }
        if (platform == "youtube"){
            await postToYoutube(id);
        }

    })
}
