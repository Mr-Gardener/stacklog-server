import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary  from "../utils/cloudinary";

const storage = new CloudinaryStorage({
    cloudinary,
    params:async (req, file) => ({
        folder: "stacklog",
        allowed_formats: ["jpg", "png", "jpeg"],
        transformation: [{ width: 1200, crop: "limit" }]
    }),
});

const upload = multer({ storage });

export default upload;