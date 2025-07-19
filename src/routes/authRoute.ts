import express from "express";
import { registerAdmin, loginUnified } from "../controllers/authController";
import { verifyToken } from "../middleware/verifyToken";
import Admin from "../models/admin";
import Author from "../models/authors";

const router = express.Router();

// Register a new authorAdmin
router.post("/register", registerAdmin);

// Login for both superAdmin and authorAdmin
router.post("/login", loginUnified);

router.get("/me", verifyToken, async (req, res) => {
  const { id, role, model } = req.user!;

  let user;
  if (model === "Admin") {
    user = await Admin.findById(id).select("-password");
  } else {
    user = await Author.findById(id).select("-password");
  }

  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json({ user }); // this way frontend can use res.data.user
});


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
