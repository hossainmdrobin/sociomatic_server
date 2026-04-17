"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const posts_controller_1 = require("./../../controllers/postController/posts.controller");
const uploads_1 = require("../../middleware/uploads");
const router = express_1.default.Router();
router.get("/get-posts", auth_middleware_1.authenticateToken, posts_controller_1.getPosts);
router.post("/add-post/text", auth_middleware_1.authenticateToken, posts_controller_1.addTextPost);
router.post("/add_post", auth_middleware_1.authenticateToken, uploads_1.upload.array("files", 10), posts_controller_1.savePostWithFiles);
router.post("/post-now", auth_middleware_1.authenticateToken, posts_controller_1.createPostNow);
router.post("/update-post/:id", auth_middleware_1.authenticateToken, posts_controller_1.updatePostById);
router.get("/get-post-by-campaign/:id", auth_middleware_1.authenticateToken, posts_controller_1.getPostByCampaign);
exports.default = router;
