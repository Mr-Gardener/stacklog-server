import express from "express";
import { registerAdmin, loginUser } from "../controllers/authController";

const router = express.Router();

router.post("/register", registerAdmin); 
router.post("/login", loginUser);       

export default router;
