import express from "express";
import {
    createComment,
    getCommentsForPost,
    approveComment,
    deleteComment,
    rejectComment
} from "../controllers/commentController";
import { verifyToken } from "../middleware/verifyToken";
import { requireRole } from "../middleware/requireRole";

const router = express.Router();

router.post("/:postId", createComment);  //anyone can comment
router.get("/post/:postId", getCommentsForPost);  //public only approved comments
router.put("/approve/:id", verifyToken, requireRole("admin"), approveComment);   //admin only
router.put("/reject/:id", verifyToken, requireRole("admin"), rejectComment)
router.delete("/:id", verifyToken, requireRole("admin"), deleteComment);   //admin only

export default router;