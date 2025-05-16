import { Request, Response } from "express";
import Post from "../models/Post";

export const getAllPosts = async (_req: Request, res: Response) => {
    const posts = await Post.find().sort({createdAt: -1});
    res.json(posts);
};

export const getPost = async(req: Request, res: Response) => {
    const post = await Post.findById(req.params.id);
    if (post) { 
        res.json(post);
    } else{
    res.status(404).json({ message: "Post not found" });
    }
};

export const createPost = async (req: Request, res: Response) => {
    const {title, content, coverImage, tags } = req.body;
    const newPost = await Post.create({ title, content, coverImage, tags });
    res.status(201).json(newPost);
};

export const updatePost = async(req: Request, res: Response) => {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.json(post);
};

export const deletePost = async(req: Request, res: Response) => {
    await Post.findByIdAndDelete(req.params.id);
    res.json({message: "Post deleted" });
};

