import {postToFacebook} from "./../services/facebook/postToFacebook"
export const publishPost = async (agenda: any) => {
    agenda.define('publish post', { concurrency: 5 }, async (job: any) => {
        const { id,type } = job.attrs.data;
        console.log(`Publishing post with ID: ${id} and type: ${type}`);
        if (!id) return;
        if(!type) return;

        if(type === "facebook"){
            await postToFacebook(id);
        }

    })
}
