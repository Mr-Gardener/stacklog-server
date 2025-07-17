import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postRoutes from "./routes/postRoutes"
import commentRoutes from './routes/commentRoutes'
import uploadRoutes from './routes/uploadRoutes'
import path from "path";
import authRoutes from "./routes/authRoute";
import createAuthorRoute from "./routes/createAuthorRoute"
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/adminRoutes";
import "./models/admin";  
import "./models/authors"; 


// Load env variables
dotenv.config();

// App setup
const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://stacklog-client.vercel.app", // Default Vercel domain 
  "https://stacklog-client-og7gfyyxn-ifechukwu-saltinas-projects.vercel.app/",
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

// Routes

app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
})

app.get("/", (_req, res) => {
    res.send("API is running...");
});

app.use("/api/posts", postRoutes);

app.use("/api/comments", commentRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);

app.use("/api/admin", createAuthorRoute);

app.use("/api/admin", adminRoutes);

// DB + Server
mongoose
    .connect(process.env.MONGO_URI || "")
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection error:", err );
    });