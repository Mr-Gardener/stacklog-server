import "../models/authors"; 
import { Request, Response} from "express";
import Post from "../models/Post";
import { AuthRequest } from "../types/express";
import "../models/admin"; 
import "../models/authors"; 



export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "name profileImage",
      })
    res.status(200).json(posts);
  } catch (error) {
    console.error("getALLposts error:", error)
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

export const getPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name profileImage role");
    if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch post" });
  }
};


export const getLatestPost = async (req: Request, res: Response) => {
  try {
    const latestPost = await Post.findOne()
      .sort({ createdAt: -1 })
      .populate("author", "name profileImage role");

    if (!latestPost) {
      return res.status(404).json({ message: "No post found" });
    }

    res.status(200).json(latestPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    console.log("🔐 req.user =", req.user);

    const user = req.user; 
    const { title, content, tags, status, coverImage } = req.body;
    const coverImageUrl = req.body.coverImage;

    if (!title || !content || !coverImageUrl) {
      return res.status(400).json({ message: "Title, content, and cover image are required." });
    }

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newPost = await Post.create({
      title,
      content,
      tags: tags?.split(",").map((tag: string) => tag.trim()), 
      coverImage: coverImageUrl,
      status,
      author: req.user!.id,
      authorModel: req.user!.model ?? "authorAdmin",
    });

    return res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while creating post",
      error: (error as Error).message,
    });
  }
};

export const getMyPosts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - No user in request" });
    }

    const posts = await Post.find({ author: req.user.id })
      .populate({
        path: "author",
        model: req.user.role === "superAdmin" || req.user.role === "moderatorAdmin" ? "Admin" : "Author"
      })
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (err: any) {
    console.error("❌ Error in getMyPosts:", err.message, err.stack);
    return res.status(500).json({
      message: "Failed to fetch post",
      error: err.message
    });
  }
};


export const updatePost = async(req: Request, res: Response) => {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.json(post);
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Post.findByIdAndDelete(id);
    if (!deleted) {
     res.status(404).json({ message: "Post not found" });
      return;
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSuggestions = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const suggestions = await Post.find({ _id: { $ne: id } })
      .sort({ createdAt: -1 })
      .limit(4)
      .populate({
        path: "author",
        select: "name profileImage", 
      });

    res.json({ suggestions });
  } catch (error) {
    console.error("❌ Error fetching suggestions:", error);
    res.status(500).json({ message: "Error fetching suggestions" });
  }
};

