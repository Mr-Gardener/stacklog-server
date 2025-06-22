import express from "express";
import { registerAdmin, loginUnified } from "../controllers/authController";

const router = express.Router();

// Register a new authorAdmin
router.post("/register", registerAdmin);

// Login for both superAdmin and authorAdmin
router.post("/login", loginUnified);

// Logout and clear token cookie
router.post("/logout", (_req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    sameSite: "lax", // Adjust based on your frontend/backend config
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;
