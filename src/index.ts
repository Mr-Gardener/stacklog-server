import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postRoutes from "./routes/postRoutes"
import commentRoutes from './routes/commentRoutes'

// Load env variables
dotenv.config();

// App setup
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
const allowedOrigins = [
    'http://localhost:5173']

const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if(!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("not allowed by CORS"))
        }
    }
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.get("/", (_req, res) => {
    res.send("API is running...");
});

app.use("/api/posts", postRoutes);

app.use("/api/comments", commentRoutes)

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