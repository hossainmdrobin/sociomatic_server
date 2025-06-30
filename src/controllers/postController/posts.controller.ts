

import { Request, Response } from 'express';
import { Post } from './../../models/post.model';

export const addTextPost = async (req: Request, res: Response) => {
    const admin = req.user.roll == "admin" ? req.user._id : req.user.admin;
    console.log(req.body)
    try {
        const newPost = new Post({ ...req.body, admin, creator: req.user._id, editor: req.user._id, })
        await newPost.save();
        res.status(200).json({ message: "Post created successfully", success: true, data: newPost });

    } catch (e) {
        console.log(e)
        res.status(500).json({ message: "Server error", seccess: false, error: e });
    }

}

export const updatePostById = async (req: Request, res: Response) => {
    const admin = req.user.roll == "admin" ? req.user._id : req.user.admin;
    try {
        const updatedPost = Post.findByIdAndUpdate(req.params.id,
            {
                ...req.body,
                $pull: { editor: req.user._id },
                $push: { editor: req.user._id }
            })
        res.status(200).json({ message: "Post Updated", success: true, data: updatedPost })
        return

    } catch(e) {
        res.status(500).json({ message: "Server error", seccess: false, error: e });
        return;

    }

}

export const getPosts = async (req: Request, res: Response) => {
    const admin = req.user.roll == "admin" ? req.user._id : req.user.admin
    try {
        console.log({ admin })
        const posts = await Post.find({ admin }).populate("creator").populate("editor").populate("account").sort({ createdAt: -1 });
        res.status(200).json({ message: "Posts fetched successfully", success: true, data: posts });
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: "Server error", seccess: false, error: e });
    }

}