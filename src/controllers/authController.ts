import { RequestHandler } from "express";
import Admin from "../models/admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.ADMIN_SECRET_KEY || "my-super-secret";

export const registerAdmin: RequestHandler = async (req, res) => {
  try {
  const { email, password, secret } = req.body;

  if (secret !== SECRET_KEY) {
    res.status(403).json({ message: "Invalid secret key" });
    return;
  }

  const existing = await Admin.findOne({ email });
  if (existing) {
    res.status(400).json({ message: "Admin already exists" });
    return;
  }

  const hashed = await bcrypt.hash(password, 12);

  const newAdmin = await Admin.create({
    email,
    password: hashed,
    role: "admin",
  });

  res.status(201).json({ message: "Admin registered" });
} catch (err){
  console.error(err);
  res.status(500).json({ message: "Server error"});
}
};

export const loginUser: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Admin.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "2h" }
    );

    res.status(200).json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};