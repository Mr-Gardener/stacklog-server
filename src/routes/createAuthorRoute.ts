import express from "express";
import {
  getAuthorById,
  createAuthorAdmin,
  getAllAuthors,
  deleteAuthor,
} from "../controllers/createAuthorController";
import { verifyToken } from "../middleware/verifyToken";
import { requireRole } from "../middleware/requireRole";

const router = express.Router();

router.post("/create-author", 
  verifyToken, 
  requireRole("superAdmin"), 
  createAuthorAdmin);
router.get("/authors", verifyToken, requireRole("superAdmin"), getAllAuthors);
router.get("/authors/:id",  verifyToken, requireRole("superAdmin"), getAuthorById);
router.delete("/authors/:id",  verifyToken, requireRole("superAdmin"), deleteAuthor);

export default router;
