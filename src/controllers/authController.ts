import { RequestHandler } from "express";
import Admin from "../models/admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Author from "../models/authors";


export const registerAdmin: RequestHandler = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) {
      res.status(400).json({ message: "Admin already exists" });
      return;
    }

    const hashed = await bcrypt.hash(password, 12);

    // If this is the first admin, make them 'superAdmin'
    // Otherwise, assign the default role 'authorAdmin'
    const adminCount = await Admin.countDocuments();
    const assignedRole = adminCount === 0 ? "superAdmin" : "authorAdmin";

    console.log("Register Admin called with body:", {
      email,
      requestedRole: req.body.role, // what frontend tried to send
      assignedRole, // what backend will use
    });

    const newAdmin = await Admin.create({
      email,
      password: hashed,
      role: assignedRole,
    });

    // Create JWT token after registration
    const token = jwt.sign(
      { id: newAdmin._id, role: newAdmin.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    )

    res.status(201).json({
      message: `${role} registered successfully.`,
      token,
      user: {
        id: newAdmin._id,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Something went wrong.", error: (error as Error).message });
  }
};

export const loginUnified: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;

    let user = await Admin.findOne({ email });
    let userType = "admin";

    if (!user) {
      user = await Author.findOne({ email });
      userType = "author";
    }

    if (!user) {
      res.status(404).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        model: user.role === "superAdmin" ? "Admin" : "Author", // matches refPath
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        model: user.model,
      },
    });
    return;
  } catch (error) {
    console.error("Unified login error:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};
