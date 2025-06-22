import express from "express"
import upload from "../middleware/multer";
import { verifyToken } from "../middleware/verifyToken";
import { updateMyProfile, getMyProfile } from "../controllers/adminController";

const router = express.Router();

router.get("/me", verifyToken, getMyProfile);
router.put("/update", verifyToken, upload.single("profileImage"), updateMyProfile);

export default router;

