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
exports.postToYoutube = void 0;
const axios_1 = __importDefault(require("axios"));
const googleapis_1 = require("googleapis");
const post_model_1 = require("./../../models/post.model");
const dotenv_1 = __importDefault(require("dotenv"));
const notification_model_1 = require("../../models/notification.model");
dotenv_1.default.config();
// POSTING VIDEOS INCLUDING iMAGE OR VIDEO
const postToYoutube = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!postId)
        return;
    try {
        const post = yield post_model_1.Post.findById(postId).populate("account");
        if (!post || post.stage === "published")
            return;
        const videoStream = yield axios_1.default.get(post.videos[0], {
            responseType: "stream",
        });
        const accessTokenData = yield axios_1.default.post("https://oauth2.googleapis.com/token", new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: post.account.token,
            grant_type: "refresh_token",
        }));
        const youtube = googleapis_1.google.youtube({
            version: "v3",
            auth: accessTokenData === null || accessTokenData === void 0 ? void 0 : accessTokenData.data.access_token, // OAuth access token
        });
        const response = yield youtube.videos.insert({
            part: ["snippet", "status"],
            requestBody: {
                snippet: {
                    title: "My Cloudinary Video",
                    description: "Uploaded from Cloudinary",
                    tags: ["cloudinary", "api"],
                    categoryId: "22",
                },
                status: {
                    privacyStatus: "public", // public | unlisted | private
                },
            },
            media: {
                body: videoStream.data, // ← Cloudinary stream here
            },
        });
        post.stage = "published";
        post.publishedAt = new Date();
        post.socialId = response.data.id;
        const notification = new notification_model_1.Notificaiton({
            admin: post.admin,
            title: "New Post Published",
            message: `A new post has been published to YouTube with ID: ${response.data.id}`,
        });
        yield notification.save();
        yield post.save();
    }
    catch (error) {
        console.error(`❌ Error posting to YouTube:`, ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
    }
});
exports.postToYoutube = postToYoutube;
