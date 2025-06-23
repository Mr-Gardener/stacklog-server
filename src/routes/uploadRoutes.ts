import express from "express"; 
import upload from "../middleware/multer";
import { Request, Response } from "express";
import util from "util";
import multer from "multer";

const router = express.Router();

router.post("/", (req, res, next) => {
  upload.single("image")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "Multer error: " + err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message }); // e.g., invalid file type
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    return res.status(200).json({ url: file.path });
  });
});


export default router;

