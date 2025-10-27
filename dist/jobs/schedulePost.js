"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = schedulePost;
const post_model_1 = require("./../models/post.model");
function schedulePost(agenda) {
    agenda.define('schedule post', { concurrency: 5 }, () => __awaiter(this, void 0, void 0, function* () {
        try {
            const posts = yield post_model_1.Post.find({ scheduledAt: { $lte: new Date() }, stage: "saved" });
            console.log(`Found ${posts.length} posts to schedule.`);
            if (posts.length === 0)
                return;
            for (const post of posts) {
                post.stage = "scheduled";
                yield post.save();
                // Schedule the post to be published in 15 seconds
                agenda.schedule("in 15 seconds", 'publish post', { id: post._id.toString(), type: post.platform });
                console.log(`Scheduled post with ID: ${post._id} to be published in 15 seconds`);
            }
        }
        catch (e) {
            console.error("Error in schedulePost job:", e);
        }
    }));
}
