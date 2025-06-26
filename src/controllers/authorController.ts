import { Request, Response } from "express";
import { AuthRequest } from "../types/express/index";
import Admin from "../models/admin";
import Post from "../models/Post";
import Comment from "../models/Comment";

export const getAuthorDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const authorId = req.user?.id;

    const [publishedCount, draftCount, pendingComments] = await Promise.all([
      Post.countDocuments({ author: authorId, status: "published" }),
      Post.countDocuments({ author: authorId, status: "draft" }),
      Comment.countDocuments({ postAuthor: authorId, status: "pending" }), // if implemented
    ]);

    const author = await Admin.findById(authorId);

    return res.json({
      name: author?.name,
      publishedCount,
      draftCount,
      pendingComments,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};
