

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
    console.log(req.body)
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id,
            {
                ...req.body,
                $addToSet: { editor: req.user._id },
                // $pull: { editor: req.user._id },
                // $push: { editor: req.user._id }
            }, {
            new: true,
            runValidators: true
        }).lean();
        console.log(updatedPost)
        if (!updatedPost) {
            res.status(404).json({ message: "Post not found", success: false });
            return;
        }
        res.status(200).json({ message: "Post Updated", success: true, data: updatedPost })
        return

    } catch (e) {
        // console.log(e)
        res.status(500).json({ message: "Server error", seccess: false, error: e });
        return;

    }

}

export const getPosts = async (req: Request, res: Response) => {
    const admin = req.user.roll == "admin" ? req.user._id : req.user.admin
    const { date } = req.query as { date: string };
    const [year, month] = date.split('-').map(Number);

    const start = new Date(year, month - 1, 1);    // e.g., July 1, 2025
    const end = new Date(year, month, 1);
    console.log(start, end )
    try {
        const posts = await Post.find({ 
            admin,
            scheduledAt: { $gte: start, $lt: end }
         }).populate("creator").populate("editor").populate("account").sort({ createdAt: -1 });
        res.status(200).json({ message: "Posts fetched successfully", success: true, data: posts });
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: "Server error", seccess: false, error: e });
    }

}