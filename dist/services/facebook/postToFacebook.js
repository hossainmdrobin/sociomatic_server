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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postToFacebook = void 0;
const axios_1 = __importDefault(require("axios"));
const post_model_1 = require("./../../models/post.model");
const dotenv_1 = __importDefault(require("dotenv"));
const notification_model_1 = require("../../models/notification.model");
dotenv_1.default.config();
const GRAPH = "https://graph.facebook.com/v19.0";
// POSTING VIDEOS INCLUDING iMAGE OR VIDEO
const postToFacebook = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!postId)
        return;
    const post = yield post_model_1.Post.findById(postId).populate("account");
    if (!post || post.stage === "published")
        return;
    try {
        // UPLOADING VIDEO IF EXISTS
        if (post.videos && post.videos.length > 0) {
            const res = yield axios_1.default.post(`https://graph.facebook.com/v17.0/${post.account.socialId}/videos`, {
                file_url: post.videos[0],
                access_token: post.account.token,
                description: post.text
            });
            console.log("Video upload response:", res);
            post.stage = "published";
            post.publishedAt = new Date();
            post.socialId = res.data.id;
            const notification = new notification_model_1.Notificaiton({
                admin: post.admin,
                title: "New Post Published",
                message: `A new post has been published to Facebook with ID: ${res.data.id}`,
            });
            yield notification.save();
            yield post.save();
            return;
        }
        // UPLOADING IMAGES IF EXISTS
        const mediaIds = [];
        console.log("Uplaoding images to Facebook...");
        for (const url of post.images) {
            const res = yield axios_1.default.post(`${GRAPH}/${post.account.socialId}/photos`, {
                url,
                published: false,
                access_token: post.account.token,
            });
            mediaIds.push({ media_fbid: res.data.id });
        }
        const url = "https://graph.facebook.com/v19.0/me/feed";
        const response = yield axios_1.default.post(url, null, {
            params: {
                message: post.text,
                attached_media: mediaIds,
                access_token: (_a = post === null || post === void 0 ? void 0 : post.account) === null || _a === void 0 ? void 0 : _a.token, // Ensure you have the correct access token
            },
        });
        post.stage = "published";
        post.publishedAt = new Date();
        post.socialId = response.data.id;
        const notification = new notification_model_1.Notificaiton({
            admin: post.admin,
            title: "New Post Published",
            message: `A new post has been published to Facebook with ID: ${response.data.id}`,
        });
        yield notification.save();
        yield post.save();
    }
    catch (error) {
        console.error(`❌ Error posting to Facebook:`, ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message);
    }
});
exports.postToFacebook = postToFacebook;
