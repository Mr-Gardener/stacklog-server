import express from "express"; 
import upload from "../middleware/multer";
import { Request, Response } from "express";
import util from "util";

const router = express.Router();

router.post("/", upload.single("image"), async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    console.log("✅ File uploaded:", util.inspect(req.file, { showHidden: false, depth: null, colors: true }));

    if (!file) {
      res.status(400).json({ message: "No file uploaded." });
      return;
    }

    // This assumes you're using Cloudinary and multer-storage-cloudinary
    res.status(200).json({ url: file.path });
  } catch (error) {
    console.error("❌ Image upload error:", error); // <-- Error log
    res.status(500).json({ message: "Image upload failed", error: (error as Error).message });
  }
});

export default router;

