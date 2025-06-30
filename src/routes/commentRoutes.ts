import express from "express";
import {
    getPendingCommentCount,
    getAllComments,
    createComment,
    getMyPostComments,
    getCommentsForPost,
    approveComment,
    deleteComment,
    rejectComment
} from "../controllers/commentController";
import { verifyToken } from "../middleware/verifyToken";
import { requireRole } from "../middleware/requireRole";
import { commentRateLimiter } from "../middleware/rateLimiter";

const router = express.Router();

router.get("/pending-count", verifyToken, requireRole("superAdmin"), getPendingCommentCount);
router.get("/", verifyToken, requireRole("superAdmin"), getAllComments);
router.get("/my-posts-comments",verifyToken,requireRole("superAdmin", "authorAdmin"),getMyPostComments);
router.post("/:postId",commentRateLimiter, createComment);  //anyone can comment
router.get("/post/:postId", getCommentsForPost);  //public only approved comments
router.put("/approve/:id", verifyToken, requireRole("superAdmin", "authorAdmin"), approveComment);   
router.put("/reject/:id", verifyToken, requireRole("superAdmin", "authorAdmin"), rejectComment)
router.delete("/:id", verifyToken, requireRole("superAdmin"), deleteComment);   //superAdmin only

export default router;