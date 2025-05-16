import express, { Router } from "express";
import {
    getAllPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
} from "../controllers/postController";
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

router.get("/", getAllPosts);
router.get("/:id", getPost);
router.post("/", createPost);
router.put("/:id",adminAuth, updatePost);
router.delete("/:id",adminAuth, deletePost);

export default router;