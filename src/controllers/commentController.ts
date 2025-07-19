import { Request, Response } from "express";
import mongoose from "mongoose";
import Comment from "../models/Comment";
import Post from "../models/Post";
import "../models/admin";     
import "../models/authors";


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
  try {
    const { authorName, email, content, website } = req.body; // `website` = honeypot
    const { postId } = req.params;

    // 🐝 Block bots that filled the honeypot field
    if (website && website.trim() !== "") {
      res.status(400).json({ message: "Spam detected" });
      return ;
    }

    // 🧪 Basic validation
    if (!postId || !authorName || !email || !content) {
      res.status(400).json({ message: "Missing required fields" });
      return ;
    }

    // ✅ Validate postId format
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400).json({ message: "Invalid post ID" });
      return ;
    }

    const comment = await Comment.create({
      postId,
      authorName,
      email,
      content,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error in createComment:", error);
    res.status(500).json({ message: "Failed to create comment" });
  }
};

export const getMyPostComments = async (req: Request, res: Response) => {
  try {
    console.log("🔍 User:", req.user);
    console.log("User ID:", req.user?.id);
    console.log("Model:", req.user?.model);

    const userId = req.user!.id;
    const userModel = req.user!.model; // From decoded JWT or middleware

    // 1. Find posts authored by the logged-in user
    const posts = await Post.find({
      author: userId,
      authorModel: userModel,
    }).select("_id");
    console.log("Posts found for authorAdmin:", posts);

    const postIds = posts.map((p) => p._id);

    // 2. Find comments for those posts
    const comments = await Comment.find({ postId: { $in: postIds } })
      .populate("postId", "title")
      .sort({ createdAt: -1 });

    console.log("💬 Comments found:", comments.length);

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
    console.error("Error in getMyPostComments:", error);
    res.status(500).json({ message: "Failed to get your post comments" });
  }
};

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
