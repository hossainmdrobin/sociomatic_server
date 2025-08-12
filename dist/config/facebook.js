"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFBGraphURL = exports.getAppSecret = exports.getAppId = void 0;
const getAppId = () => process.env.FACEBOOK_CLIENT_ID;
exports.getAppId = getAppId;
const getAppSecret = () => process.env.FACEBOOK_CLIENT_SECRET;
exports.getAppSecret = getAppSecret;
const getFBGraphURL = () => process.env.FB_GRAPH_API_URL;
exports.getFBGraphURL = getFBGraphURL;
