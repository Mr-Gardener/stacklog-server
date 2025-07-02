import express, { Router } from "express";
import {
    getAllPosts,
    getPost,
    getLatestPost,
    createPost,
    getMyPosts,
    updatePost,
    deletePost,
    getSuggestions
} from "../controllers/postController";
import { verifyToken } from "../middleware/verifyToken";
import { requireRole } from "../middleware/requireRole";
import { AuthRequest } from "../types/express";
import { Response, Request, NextFunction } from "express";
import Post from "../models/Post";


const router = express.Router();

router.get("/", getAllPosts);

router.get("/search", (req: Request, res: Response, next: NextFunction) => {
  (async () => {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({ message: "Missing or invalid query parameter." });
    }

    try {
      const regex = new RegExp(q, "i");

      const posts = await Post.find({
        $or: [{ title: regex }, { tags: regex }],
      })
        .limit(10)
        .sort({ createdAt: -1 })
        .populate("author", "name profileImage");

      res.json(posts);
    } catch (err) {
      console.error("Search error:", err);
      next(err);
    }
  })();
});



router.get("/latest", (req, res, next) => {
  getLatestPost(req, res)
  .catch(next);
});
router.get("/my-posts", verifyToken, async (req: AuthRequest, res: Response, next) => {
  console.log("🔹 /api/posts/my-posts HIT");

  try {
    await getMyPosts(req, res);
  } catch (err) {
    next(err);
  }
});
router.get("/suggestions/:id", getSuggestions);
router.get("/:id", getPost);
router.post(
  "/create",
  verifyToken,
  requireRole("superAdmin", "authorAdmin"),
  (req, res, next) => {
    createPost(req, res).catch(next);
  }
);
router.put("/:id",verifyToken, requireRole("superAdmin"), updatePost);
router.delete("/:id",verifyToken, requireRole("superAdmin"), deletePost);

export default router;



