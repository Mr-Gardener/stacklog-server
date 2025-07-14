import express from "express"
import upload from "../middleware/multer";
import { verifyToken } from "../middleware/verifyToken";
import { updateMyProfile, getMyProfile, getPublicAuthor } from "../controllers/adminController";
import Admin from "../models/admin";
import { Request, Response } from "express";

const router = express.Router();

router.get("/me", verifyToken, getMyProfile);
router.put("/update", verifyToken, upload.single("profileImage"), updateMyProfile);
router.get("/public/:id", getPublicAuthor);

export default router;