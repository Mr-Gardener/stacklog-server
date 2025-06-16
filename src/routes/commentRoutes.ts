import express from "express";
import {
    getPendingCommentCount,
    getAllComments,
    createComment,
    getCommentsForPost,
    approveComment,
    deleteComment,
    rejectComment
} from "../controllers/commentController";
import { verifyToken } from "../middleware/verifyToken";
import { requireRole } from "../middleware/requireRole";

const router = express.Router();

router.get("/pending-count", verifyToken, requireRole("superAdmin"), getPendingCommentCount);
router.get("/", verifyToken, requireRole("superAdmin"), getAllComments);
router.post("/:postId", createComment);  //anyone can comment
router.get("/post/:postId", getCommentsForPost);  //public only approved comments
router.put("/approve/:id", verifyToken, requireRole("superAdmin"), approveComment);   //superAdmin only
router.put("/reject/:id", verifyToken, requireRole("superAdmin"), rejectComment)
router.delete("/:id", verifyToken, requireRole("superAdmin"), deleteComment);   //superAdmin only

export default router;