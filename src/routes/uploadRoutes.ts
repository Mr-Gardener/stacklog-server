import express from "express";
import upload from "../middleware/multer";
import { Request, Response } from "express";

const router = express.Router();

router.post("/", upload.single("image"), async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ message: "No file uploaded." });
      return;
    }

    // `req.file.path` should be the Cloudinary URL
    res.status(200).json({ url: file.path });
  } catch (error) {
    res.status(500).json({ message: "Image upload failed", error: (error as Error).message });
  }
});

export default router;
