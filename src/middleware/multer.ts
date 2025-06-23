import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary";

// Storage to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "stacklog",
    allowed_formats: ["jpg", "jpeg", "png"], // Cloudinary side
    transformation: [{ width: 1200, crop: "limit" }],
  }),
});

// ✅ File type check before uploading
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only .jpg, .jpeg, and .png files are allowed!"));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

export default upload;
