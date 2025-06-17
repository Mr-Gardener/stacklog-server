import express from "express";
import { registerAdmin, loginUnified } from "../controllers/authController";

const router = express.Router();

router.post("/register", registerAdmin); 
router.post("/login", loginUnified);       

export default router;
