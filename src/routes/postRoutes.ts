import express, { Router } from "express";
import {
    getAllPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
} from "../controllers/postController";
import { verifyToken } from "../middleware/verifyToken";
import { requireRole } from "../middleware/requireRole";


const router = express.Router();

router.get("/", getAllPosts);
router.get("/:id", getPost);
router.post("/",verifyToken, requireRole("admin"), createPost);
router.put("/:id",verifyToken, requireRole("admin"), updatePost);
router.delete("/:id",verifyToken, requireRole("admin"), deletePost);

export default router;