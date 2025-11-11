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
exports.publishPost = void 0;
const postToFacebook_1 = require("./../services/facebook/postToFacebook");
const publishPost = (agenda) => __awaiter(void 0, void 0, void 0, function* () {
    agenda.define('publish post', { concurrency: 5 }, (job) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, platform } = job.attrs.data;
        console.log(`Publishing post with ID: ${id} and type: ${platform}`);
        if (!id)
            return;
        if (!platform)
            return;
        if (platform === "facebook") {
            yield (0, postToFacebook_1.postToFacebook)(id);
        }
    }));
});
exports.publishPost = publishPost;
