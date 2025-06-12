import express from "express";
import {
  createAuthorAdmin,
  getAllAuthors,
  deleteAuthor,
} from "../controllers/createAuthorController";
import { verifyToken } from "../middleware/verifyToken";
import { requireRole } from "../middleware/requireRole";

const router = express.Router();

router.post("/create-author",  verifyToken, requireRole("superAdmin"), createAuthorAdmin);
router.get("/authors", verifyToken, requireRole("superAdmin"), getAllAuthors);
router.delete("/authors/:id",  verifyToken, requireRole("superAdmin"), deleteAuthor);

export default router;
