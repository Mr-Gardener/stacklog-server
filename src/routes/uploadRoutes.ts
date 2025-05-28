import express, { Request, Response, RequestHandler } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";

interface MulterRequest extends Request {
  file: Express.Multer.File;
}

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({storage});

const handleUpload: RequestHandler = (req, res) => {
    const typedReq = req as MulterRequest;

    if (!typedReq.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
    }


const filePath = `/uploads/${typedReq.file.filename}`;
res.status(200).json({ url: filePath });
};

router.post("/", upload.single("image"), handleUpload);



export default router;