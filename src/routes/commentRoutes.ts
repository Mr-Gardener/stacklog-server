import express from "express";
import {
    createComment,
    getCommentsForPost,
    approveComment,
    deleteComment,
    rejectComment
} from "../controllers/commentController";
import { adminAuth  } from "../middleware/adminAuth";

const router = express.Router();

router.post("/:postId", createComment);  //anyone can comment
router.get("/post/:postId", getCommentsForPost);  //public only approved comments
router.put("/approve/:id", adminAuth, approveComment);   //admin only
router.put("/reject/:id", adminAuth, rejectComment)
router.delete("/:id", adminAuth, deleteComment);   //admin only

export default router;