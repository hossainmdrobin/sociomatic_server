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
    var _a, _b, _c, _d;
    if (!postId)
        return;
    const post = yield post_model_1.Post.findById(postId).populate("account");
    if (!post || post.stage === "published")
        return;
    try {
        const url = `https://graph.facebook.com/v23.0/${(_a = post === null || post === void 0 ? void 0 : post.account) === null || _a === void 0 ? void 0 : _a.socialId}/feed?access_token=${(_b = post === null || post === void 0 ? void 0 : post.account) === null || _b === void 0 ? void 0 : _b.token}`;
        const response = yield axios_1.default.post(url, {
            message: post.text,
            access_token: (_c = post === null || post === void 0 ? void 0 : post.account) === null || _c === void 0 ? void 0 : _c.token, // Ensure you have the correct access token
            published: true
        });
        post.stage = "published";
        post.publishedAt = new Date();
        post.socialId = response.data.id;
        yield post.save();
        console.log(`✅ Posted to Facebook: ${response.data.id}`);
    }
    catch (error) {
        console.error(`❌ Error posting to Facebook:`, ((_d = error.response) === null || _d === void 0 ? void 0 : _d.data) || error.message);
    }
});
exports.postToFacebook = postToFacebook;
