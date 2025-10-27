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
exports.getPosts = exports.updatePostById = exports.addTextPost = void 0;
const post_model_1 = require("./../../models/post.model");
const addTextPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = req.user.roll == "admin" ? req.user._id : req.user.admin;
    try {
        const newPost = new post_model_1.Post(Object.assign(Object.assign({}, req.body), { admin, creator: req.user._id, editor: req.user._id, stage: req.body.stage || "saved" }));
        yield newPost.save();
        res.status(200).json({ message: "Post created successfully", success: true, data: newPost });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "Server error", seccess: false, error: e });
    }
});
exports.addTextPost = addTextPost;
const updatePostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = req.user.roll == "admin" ? req.user._id : req.user.admin;
    console.log(req.body);
    try {
        const updatedPost = yield post_model_1.Post.findByIdAndUpdate(req.params.id, Object.assign(Object.assign({}, req.body), { $addToSet: { editor: req.user._id } }), {
            new: true,
            runValidators: true
        }).lean();
        console.log(updatedPost);
        if (!updatedPost) {
            res.status(404).json({ message: "Post not found", success: false });
            return;
        }
        res.status(200).json({ message: "Post Updated", success: true, data: updatedPost });
        return;
    }
    catch (e) {
        // console.log(e)
        res.status(500).json({ message: "Server error", seccess: false, error: e });
        return;
    }
});
exports.updatePostById = updatePostById;
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = req.user.roll == "admin" ? req.user._id : req.user.admin;
    const { date } = req.query;
    const [year, month] = date.split('-').map(Number);
    const start = new Date(year, month - 1, 1); // e.g., July 1, 2025
    const end = new Date(year, month, 1);
    console.log(start, end);
    try {
        const posts = yield post_model_1.Post.find({
            admin,
            scheduledAt: { $gte: start, $lt: end }
        }).populate("creator").populate("editor").populate("account").sort({ createdAt: -1 });
        res.status(200).json({ message: "Posts fetched successfully", success: true, data: posts });
    }
    catch (e) {
        res.status(500).json({ message: "Server error", seccess: false, error: e });
    }
});
exports.getPosts = getPosts;
