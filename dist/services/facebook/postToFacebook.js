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
dotenv_1.default.config();
const postToFacebook = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!postId)
        return;
    const post = yield post_model_1.Post.findById(postId).populate("account");
    if (!post || post.stage === "published")
        return;
    try {
        const url = "https://graph.facebook.com/v19.0/me/feed";
        const response = yield axios_1.default.post(url, null, {
            params: {
                message: post.text,
                access_token: (_a = post === null || post === void 0 ? void 0 : post.account) === null || _a === void 0 ? void 0 : _a.token, // Ensure you have the correct access token
            },
        });
        post.stage = "published";
        post.publishedAt = new Date();
        post.socialId = response.data.id;
        yield post.save();
        console.log(`✅ Posted to Facebook: ${response.data.id}`);
    }
    catch (error) {
        console.error(`❌ Error posting to Facebook:`, ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message);
    }
});
exports.postToFacebook = postToFacebook;
