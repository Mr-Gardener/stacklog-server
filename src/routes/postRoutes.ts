import express, { Router } from "express";
import {
    getAllPosts,
    getPost,
    getLatestPost,
    createPost,
    getMyPosts,
    updatePost,
    deletePost
} from "../controllers/postController";
import { verifyToken } from "../middleware/verifyToken";
import { requireRole } from "../middleware/requireRole";
import { AuthRequest } from "../types/express";
import { Response } from "express";


const router = express.Router();

router.get("/", getAllPosts);
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



