import express, { Router } from "express";
import {
    getAllPosts,
    getPost,
    getLatestPost,
    createPost,
    updatePost,
    deletePost
} from "../controllers/postController";
import { verifyToken } from "../middleware/verifyToken";
import { requireRole } from "../middleware/requireRole";
import upload from "../middleware/multer";


const router = express.Router();

router.get("/", getAllPosts);
router.get("/latest", (req, res, next) => {
  getLatestPost(req, res)
  .catch(next);
});
router.get("/:id", getPost);
router.post(
  "/create",
  verifyToken,
  requireRole("admin"),
  upload.single("coverImage"),
  (req, res, next) => {
    createPost(req, res).catch(next);
  }
);
router.put("/:id",verifyToken, requireRole("admin"), updatePost);
router.delete("/:id",verifyToken, requireRole("admin"), deletePost);

export default router;



