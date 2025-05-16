import { Request, Response } from "express";
import Comment from "../models/Comment";

export const createComment = async (req: Request, res: Response) => {
    const {postId, authorName, email, content} = req.body;
    const comment = await Comment.create({ postId, authorName, email, content });
    res.status(201).json(comment);
}

export const getCommentsForPost = async (req: Request, res: Response) => {
    const comments = await Comment.find({ 
        postId: req.params.postId, 
        status: "approved"
    }).sort({ createdAt: -1});
    res.json(comments);
}

export const approveComment = async (req: Request, res: Response) =>{
    const comment = await Comment.findByIdAndUpdate(
        req.params.id, 
        {status: "approved"}, 
        {new: true}
    );
    res.json(comment);
}

export const rejectComment = async (req: Request, res: Response) => {
    const comment = await Comment.findByIdAndUpdate(
        req.params.id,
        {status: "rejected"},
        {new: true}
    );
    res.json(comment);
};

export const deleteComment = async (req: Request, res: Response) => {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "comment deleted"});
};