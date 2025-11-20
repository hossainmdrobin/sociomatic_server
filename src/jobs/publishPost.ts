import {postToFacebook} from "./../services/facebook/postToFacebook"
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

    })
}
