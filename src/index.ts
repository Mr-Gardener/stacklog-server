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
import type {} from "./types/express"; 


// Load env variables
dotenv.config();

// App setup
const app = express();
const PORT = process.env.PORT || 5000;

// const allowedOrigins = [
//   "https://stacklog-client.vercel.app"
// ];

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// }));


app.use(cors({
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"], // Add more if needed
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