import { Request, Response } from "express";
import Comment from "../models/Comment";


export const getAllComments = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    const query: any = {};
    if (status) query.status = status;

    const comments = await Comment.find(query)
      .populate("postId", "title")
      .sort({ createdAt: -1 });

    const formatted = comments.map((comment) => ({
      _id: comment._id,
      content: comment.content,
      status: comment.status,
      createdAt: comment.createdAt,
      email: comment.email,
      authorName: comment.authorName,
      postTitle: (comment.postId as any)?.title || "Unknown",
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error in getAllComments:", error);
    res.status(500).json({ message: "Failed to get comments" });
  }
};


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

export const getPendingCommentCount = async (req: Request, res: Response) => {
  try {
    const count = await Comment.countDocuments({ status: "pending" });
    res.json({ pendingCount: count });
  } catch (error) {
    res.status(500).json({ message: "Failed to count pending comments" });
  }
};
