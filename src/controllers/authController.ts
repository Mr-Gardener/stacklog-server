import { RequestHandler } from "express";
import Admin from "../models/admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// export const registerAdmin: RequestHandler = async (req, res) => {
//   try {
//   const { email, password} = req.body;

//   const existing = await Admin.findOne({ email });
//   if (existing) {
//     res.status(400).json({ message: "Admin already exists" });
//     return;
//   }

//   const hashed = await bcrypt.hash(password, 12);

//   const newAdmin = await Admin.create({
//     email,
//     password: hashed,
//     role: "admin",
//   });

//   res.status(201).json({ message: "Admin registered" });
// } catch (error) {
//   const err = error as Error;
//   console.error("Auth error:", err);
//   res.status(500).json({ message: "Something went wrong.", error: err.message });
//   }
// };

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
      process.env.JWT_SECRET!,
      { expiresIn: "2h" }
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

    res.status(200).json({ 
      token, 
       user: {
            id: user._id,
            email: user.email,
            role: user.role,
              }
    });
  } catch (error) {
    const err = error as Error;
    console.error("Auth error:", error);
  res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
};