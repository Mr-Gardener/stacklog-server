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


// Load env variables
dotenv.config();

// App setup
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
// const allowedOrigins = [
//     'http://localhost:5173']

// const corsOptions = {
//     origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
//         if(!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error("not allowed by CORS"))
//         }
//     },
//     Credentials: true,
// };

// app.use(cors(corsOptions));



app.use(cors({
  origin: "http://localhost:5173",   // your Vite dev origin
  credentials: true,                 // this is required for cookies/auth
}));

app.use(cookieParser());
app.use(express.json());

// Routes
app.get("/", (_req, res) => {
    res.send("API is running...");
});

app.use("/api/posts", postRoutes);

app.use("/api/comments", commentRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);

app.use("/api/admin", createAuthorRoute);


app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
})

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